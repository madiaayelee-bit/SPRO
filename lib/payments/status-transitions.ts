import type { PaymentStatus } from "@/app/generated/prisma/client";

/** Transitions de statut autorisées — empêche par exemple de "ressusciter" une transaction déjà FAILED/EXPIRED. */
export const ALLOWED_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  PENDING: ["PROCESSING", "SUCCESS", "FAILED", "CANCELLED", "EXPIRED"],
  PROCESSING: ["SUCCESS", "FAILED", "EXPIRED"],
  SUCCESS: ["REFUNDED"],
  FAILED: [],
  CANCELLED: [],
  EXPIRED: [],
  REFUNDED: [],
};

/** `from === to` est considéré valide (idempotent, pas une vraie transition). */
export function isValidTransition(from: PaymentStatus, to: PaymentStatus): boolean {
  if (from === to) return true;
  return ALLOWED_TRANSITIONS[from].includes(to);
}
