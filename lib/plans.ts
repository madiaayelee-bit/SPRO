import type { PlanTier } from "@/app/generated/prisma/client";

export const PLAN_LIMITS: Record<
  PlanTier,
  {
    maxClients: number;
    maxStaffUsers: number;
    maxPhotosPerRepair: number;
    pdfExport: boolean;
    clientPortal: boolean;
  }
> = {
  FREE: {
    maxClients: 20,
    maxStaffUsers: 1,
    maxPhotosPerRepair: 2,
    pdfExport: false,
    clientPortal: false,
  },
  PRO: {
    maxClients: 200,
    maxStaffUsers: 3,
    maxPhotosPerRepair: 10,
    pdfExport: true,
    clientPortal: true,
  },
  PREMIUM: {
    maxClients: Infinity,
    maxStaffUsers: Infinity,
    maxPhotosPerRepair: 30,
    pdfExport: true,
    clientPortal: true,
  },
};

export const PLAN_LABELS: Record<PlanTier, string> = {
  FREE: "Gratuit",
  PRO: "Pro",
  PREMIUM: "Premium",
};

// Montant réel = celui du Price Stripe configuré (STRIPE_PRICE_ID_PRO/PREMIUM
// dans .env) — jamais recalculé côté client. Ces valeurs ne servent qu'à
// l'affichage informatif ; tant qu'aucun tarif définitif n'est décidé, on
// affiche "Tarif à configurer" plutôt qu'un prix inventé.
export const PLAN_PRICES_EUR: Record<PlanTier, number | null> = {
  FREE: 0,
  PRO: null, // TODO — tarif à configurer
  PREMIUM: null, // TODO — tarif à configurer
};

export function formatPlanPrice(plan: PlanTier): string {
  const price = PLAN_PRICES_EUR[plan];
  if (price === null) return "Tarif à configurer";
  return price === 0 ? "0 € / mois" : `${price} € / mois`;
}
