import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripeClient, STRIPE_PRICE_IDS } from "@/lib/payments/providers/stripe";
import {
  recordWebhookEvent,
  findTransactionByReference,
  updateTransactionStatus,
} from "@/lib/db/payments";
import type Stripe from "stripe";

function planFromPriceId(priceId: string | undefined) {
  if (priceId === STRIPE_PRICE_IDS.PRO) return "PRO" as const;
  if (priceId === STRIPE_PRICE_IDS.PREMIUM) return "PREMIUM" as const;
  return null;
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret || webhookSecret.includes("placeholder")) {
    return NextResponse.json({ error: "Stripe n'est pas configuré" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  // Idempotence : l'identifiant d'événement Stripe (unique et fourni par
  // Stripe lui-même) empêche tout retraitement si le même événement est
  // livré plusieurs fois.
  const { alreadyProcessed } = await recordWebhookEvent({
    transactionId: null,
    provider: "STRIPE",
    eventId: event.id,
    signatureValid: true,
    rawPayload: event as unknown,
  });
  if (alreadyProcessed) {
    return NextResponse.json({ received: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const garageId = checkoutSession.metadata?.garageId || checkoutSession.client_reference_id;
      if (!garageId || typeof checkoutSession.subscription !== "string") break;

      const stripeSubscription = await stripe.subscriptions.retrieve(
        checkoutSession.subscription
      );
      const priceId = stripeSubscription.items.data[0]?.price.id;
      const plan = planFromPriceId(priceId);

      await prisma.subscription.upsert({
        where: { garageId },
        create: {
          garageId,
          plan: plan ?? "FREE",
          status: "ACTIVE",
          stripeCustomerId: String(checkoutSession.customer),
          stripeSubscriptionId: stripeSubscription.id,
          stripePriceId: priceId,
        },
        update: {
          plan: plan ?? "FREE",
          status: "ACTIVE",
          stripeCustomerId: String(checkoutSession.customer),
          stripeSubscriptionId: stripeSubscription.id,
          stripePriceId: priceId,
        },
      });

      // Journalise la confirmation sur la trace de paiement créée à
      // l'initiation du checkout (voir app/api/stripe/checkout/route.ts).
      const paymentReference = checkoutSession.metadata?.paymentReference;
      if (paymentReference) {
        const transaction = await findTransactionByReference(paymentReference);
        if (transaction) {
          await updateTransactionStatus(transaction.id, "SUCCESS", {
            externalReference: checkoutSession.id,
          });
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const stripeSubscription = event.data.object as Stripe.Subscription;
      const priceId = stripeSubscription.items.data[0]?.price.id;
      const plan = planFromPriceId(priceId);
      const periodEnd = stripeSubscription.items.data[0]?.current_period_end;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: stripeSubscription.id },
        data: {
          plan: plan ?? undefined,
          status: mapStripeStatus(stripeSubscription.status),
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : undefined,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const stripeSubscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: stripeSubscription.id },
        data: { plan: "FREE", status: "CANCELED" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED" | "INCOMPLETE" {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
    case "unpaid":
      return "CANCELED";
    default:
      return "INCOMPLETE";
  }
}
