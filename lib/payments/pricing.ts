import type { PlanTier } from "@/app/generated/prisma/client";

/**
 * Tarifs mensuels réels, fournis par l'utilisateur pour le XOF (la devise
 * effectivement utilisée par PayDunya). Les autres devises restent
 * `null` ("TODO — tarif à configurer") tant qu'aucun montant réel n'a été
 * donné pour elles spécifiquement — jamais de conversion ou de prix
 * inventé. Tant qu'une valeur reste `null`, le paiement mobile money pour
 * cette formule/devise est désactivé côté serveur (voir
 * lib/actions/payments.ts).
 */
export const PLAN_PRICES_BY_CURRENCY: Record<string, Record<Exclude<PlanTier, "FREE">, number | null>> = {
  XOF: { PRO: 9500, PREMIUM: 19500 }, // confirmé par l'utilisateur, tarif mensuel
  XAF: { PRO: null, PREMIUM: null },
  GNF: { PRO: null, PREMIUM: null },
  CDF: { PRO: null, PREMIUM: null },
  KES: { PRO: null, PREMIUM: null },
  TZS: { PRO: null, PREMIUM: null },
  UGX: { PRO: null, PREMIUM: null },
};

export function getPlanPrice(currency: string, plan: Exclude<PlanTier, "FREE">): number | null {
  return PLAN_PRICES_BY_CURRENCY[currency]?.[plan] ?? null;
}
