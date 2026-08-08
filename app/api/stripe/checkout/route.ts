import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripeClient, STRIPE_PRICE_IDS } from "@/lib/payments/providers/stripe";
import { stripeCheckoutSchema } from "@/lib/validations/payments";
import { createPendingTransaction } from "@/lib/db/payments";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.accountType !== "STAFF" || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe n'est pas configuré — ajoutez vos clés API pour activer les formules payantes." },
      { status: 503 }
    );
  }

  const parsed = stripeCheckoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Formule invalide" }, { status: 400 });
  }
  const { plan } = parsed.data;
  const priceId = STRIPE_PRICE_IDS[plan];
  if (!priceId) {
    return NextResponse.json(
      { error: `Aucun Price Stripe configuré pour la formule ${plan}.` },
      { status: 503 }
    );
  }

  const garageId = session.user.garageId;
  const [garage, subscription] = await Promise.all([
    prisma.garage.findUnique({ where: { id: garageId } }),
    prisma.subscription.findUnique({ where: { garageId } }),
  ]);
  if (!garage) {
    return NextResponse.json({ error: "Garage introuvable" }, { status: 404 });
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";

  // Le montant journalisé vient du Price Stripe lui-même — jamais inventé
  // ni recalculé localement — pour que la trace d'audit reflète exactement
  // ce que Stripe va effectivement facturer.
  const price = await stripe.prices.retrieve(priceId);
  const amount = (price.unit_amount ?? 0) / 100;
  const currency = price.currency.toUpperCase();

  const transaction = await createPendingTransaction(garageId, {
    provider: "STRIPE",
    channel: "CARD",
    currency,
    amount,
    planTier: plan,
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: garageId,
    customer: subscription?.stripeCustomerId || undefined,
    customer_email: subscription?.stripeCustomerId ? undefined : garage.email || undefined,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/parametres/abonnement?checkout=success`,
    cancel_url: `${appUrl}/dashboard/parametres/abonnement?checkout=cancelled`,
    metadata: { garageId, plan, paymentReference: transaction.reference },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
