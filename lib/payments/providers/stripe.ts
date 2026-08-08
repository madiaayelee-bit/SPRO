import Stripe from "stripe";
import { isStripeConfigured } from "../config";

/**
 * Stripe reste le prestataire pour les cartes bancaires internationales
 * (formules Pro/Premium en EUR). Contrairement à PayDunya (paiement ponctuel
 * via facture), Stripe gère ici un **abonnement récurrent** — les champs
 * spécifiques à ce cycle de vie (période en cours, annulation programmée)
 * restent gérés directement sur le modèle `Subscription`, en plus de la
 * journalisation commune dans `PaymentTransaction`/`PaymentWebhookEvent`
 * effectuée par `app/api/stripe/webhook/route.ts`.
 */

let stripeClient: Stripe | null = null;

/** Renvoie `null` tant que de vraies clés Stripe ne sont pas configurées. */
export function getStripeClient(): Stripe | null {
  if (!isStripeConfigured()) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeClient;
}

export const STRIPE_PRICE_IDS = {
  PRO: process.env.STRIPE_PRICE_ID_PRO,
  PREMIUM: process.env.STRIPE_PRICE_ID_PREMIUM,
} as const;

export { isStripeConfigured };
