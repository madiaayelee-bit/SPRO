/**
 * Journalisation de diagnostic pour le parcours de paiement — jamais de clé
 * API, secret, mot de passe ou numéro de téléphone complet. Le type des
 * champs acceptés ci-dessous fait volontairement office de liste blanche :
 * il est impossible d'y passer un champ non prévu par erreur.
 */
export type PaymentLogEvent =
  | "payment_created"
  | "payment_pending"
  | "payment_success"
  | "payment_failed"
  | "payment_cancelled"
  | "payment_callback_received";

export function logPaymentEvent(
  event: PaymentLogEvent,
  data: {
    reference?: string;
    transactionId?: string;
    garageId?: string;
    provider?: string;
    amount?: number;
    currency?: string;
    reason?: string;
  }
) {
  console.log(`[payment] ${event}`, data);
}
