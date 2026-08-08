import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/plans";
import type { PlanTier } from "@/app/generated/prisma/client";

export class PlanLimitExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanLimitExceededError";
  }
}

export async function getGaragePlan(garageId: string): Promise<PlanTier> {
  const subscription = await prisma.subscription.findUnique({ where: { garageId } });
  return subscription?.plan ?? "FREE";
}

/**
 * À appeler côté serveur (Server Action / Route Handler) avant toute
 * création soumise à une limite de plan — jamais seulement caché côté UI,
 * pour ne pas pouvoir être contourné via un appel direct à l'API.
 */
export async function assertWithinLimit(
  garageId: string,
  limitKey: "maxClients" | "maxStaffUsers" | "maxPhotosPerRepair",
  currentCount: number
) {
  const plan = await getGaragePlan(garageId);
  const limit = PLAN_LIMITS[plan][limitKey];
  if (currentCount >= limit) {
    throw new PlanLimitExceededError(
      `Limite de votre formule atteinte (${limit}). Passez à une formule supérieure pour continuer.`
    );
  }
}

export async function assertFeatureEnabled(
  garageId: string,
  featureKey: "pdfExport" | "clientPortal"
) {
  const plan = await getGaragePlan(garageId);
  if (!PLAN_LIMITS[plan][featureKey]) {
    throw new PlanLimitExceededError(
      "Cette fonctionnalité nécessite une formule Pro ou Premium."
    );
  }
}
