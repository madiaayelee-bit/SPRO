import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripeClient } from "@/lib/payments/providers/stripe";

export async function POST() {
  const session = await auth();
  if (!session?.user || session.user.accountType !== "STAFF" || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe n'est pas configuré" }, { status: 503 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { garageId: session.user.garageId },
  });
  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "Aucun abonnement Stripe actif" }, { status: 400 });
  }

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${appUrl}/dashboard/parametres/abonnement`,
  });

  return NextResponse.json({ url: portalSession.url });
}
