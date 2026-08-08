import type { PaymentChannel } from "@/app/generated/prisma/client";
import type { MobileMoneyAdapter } from "./types";
import { PayDunyaAdapter } from "./providers/paydunya";
import { FlutterwaveAdapter } from "./providers/flutterwave";

const paydunyaAdapter = new PayDunyaAdapter();
const flutterwaveAdapter = new FlutterwaveAdapter();

/**
 * Point d'extension unique pour brancher un vrai prestataire par canal.
 *
 * Wave / Orange Money / Free Money → PayDunya, dont le bundle confirmé
 * couvre ces trois opérateurs (voir lib/payments/providers/paydunya.ts).
 * Les autres canaux (MTN, Moov, Airtel, M-Pesa) n'ont pas de couverture
 * PayDunya confirmée par nos recherches — ils restent routés vers
 * Flutterwave, qui reste NOT_CONFIGURED tant qu'aucun compte n'existe.
 *
 * Pour ajouter un prestataire réel : créer lib/payments/providers/<nom>.ts
 * implémentant MobileMoneyAdapter, puis remplacer les entrées concernées
 * ci-dessous — rien d'autre à changer dans l'application.
 */
const CHANNEL_ADAPTERS: Record<PaymentChannel, MobileMoneyAdapter> = {
  ORANGE_MONEY: paydunyaAdapter,
  WAVE: paydunyaAdapter,
  FREE_MONEY: paydunyaAdapter,
  MTN_MOMO: flutterwaveAdapter,
  MOOV_MONEY: flutterwaveAdapter,
  AIRTEL_MONEY: flutterwaveAdapter,
  MPESA: flutterwaveAdapter,
  CARD: flutterwaveAdapter, // Stripe gère les cartes via son propre flux, voir lib/payments/providers/stripe.ts
};

export function getAdapterForChannel(channel: PaymentChannel): MobileMoneyAdapter {
  return CHANNEL_ADAPTERS[channel];
}

const ALL_ADAPTERS = [paydunyaAdapter, flutterwaveAdapter];

export function getAdapterByProviderName(providerName: string): MobileMoneyAdapter | null {
  return ALL_ADAPTERS.find((a) => a.providerName === providerName) ?? null;
}
