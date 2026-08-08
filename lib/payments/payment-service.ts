import type { PaymentChannel, PlanTier } from "@/app/generated/prisma/client";
import {
  createPendingTransaction,
  updateTransactionStatus,
  findTransactionByReference,
  findTransactionByExternalReference,
  recordWebhookEvent,
} from "@/lib/db/payments";
import { getAdapterForChannel, getAdapterByProviderName } from "./registry";
import { PaymentProviderNotConfiguredError } from "./types";
import { amountAndCurrencyMatch } from "./verify";
import { logPaymentEvent } from "./logger";

/**
 * Point d'entrée unique utilisé par les Server Actions/routes pour tout ce
 * qui touche au paiement — aucun appelant ne doit parler directement à un
 * adaptateur de prestataire.
 */
export async function initiateMobileMoneyPayment(
  garageId: string,
  params: {
    channel: PaymentChannel;
    countryCode: string;
    currency: string;
    amount: number;
    phoneNumber: string;
    planTier: PlanTier;
  }
) {
  const adapter = getAdapterForChannel(params.channel);

  const transaction = await createPendingTransaction(garageId, {
    provider: adapter.providerName,
    channel: params.channel,
    countryCode: params.countryCode,
    currency: params.currency,
    amount: params.amount,
    phoneNumber: params.phoneNumber,
    planTier: params.planTier,
  });
  logPaymentEvent("payment_created", {
    reference: transaction.reference,
    transactionId: transaction.id,
    garageId,
    provider: adapter.providerName,
    amount: params.amount,
    currency: params.currency,
  });

  try {
    const result = await adapter.initiatePayment({
      reference: transaction.reference,
      amount: params.amount,
      currency: params.currency,
      countryCode: params.countryCode,
      channel: params.channel,
      phoneNumber: params.phoneNumber,
      description: `Garage Pro — formule ${params.planTier}`,
    });
    await updateTransactionStatus(transaction.id, result.status, {
      externalReference: result.externalReference,
    });
    logPaymentEvent("payment_pending", {
      reference: transaction.reference,
      transactionId: transaction.id,
      garageId,
      provider: adapter.providerName,
    });
    return { transaction, redirectUrl: result.redirectUrl };
  } catch (err) {
    const message =
      err instanceof PaymentProviderNotConfiguredError || err instanceof Error
        ? err.message
        : "Échec de l'initiation du paiement.";
    await updateTransactionStatus(transaction.id, "FAILED", { failureReason: message });
    logPaymentEvent("payment_failed", {
      reference: transaction.reference,
      transactionId: transaction.id,
      garageId,
      provider: adapter.providerName,
      reason: message,
    });
    throw new Error(message);
  }
}

export type WebhookProcessResult =
  | { ok: true }
  | { ok: false; httpStatus: 400 | 404 | 503; error: string };

/**
 * Traite un webhook entrant pour un prestataire mobile money donné —
 * vérifie l'authenticité, l'idempotence, puis le montant/devise avant de
 * faire confiance au statut annoncé.
 */
export async function processProviderWebhook(
  providerKey: string,
  rawBody: string,
  headers: Headers
): Promise<WebhookProcessResult> {
  logPaymentEvent("payment_callback_received", { provider: providerKey });

  const adapter = getAdapterByProviderName(providerKey.toUpperCase());
  if (!adapter || !adapter.isConfigured()) {
    return { ok: false, httpStatus: 503, error: "Prestataire non configuré" };
  }

  let verification;
  try {
    verification = await adapter.parseWebhook(rawBody, headers);
  } catch {
    return { ok: false, httpStatus: 400, error: "Échec de traitement du webhook" };
  }

  if (!verification.valid) {
    return { ok: false, httpStatus: 400, error: "Signature invalide" };
  }

  const transaction =
    (await findTransactionByReference(verification.externalReference)) ??
    (await findTransactionByExternalReference(verification.externalReference));

  if (!transaction) {
    await recordWebhookEvent({
      transactionId: null,
      provider: providerKey,
      eventId: verification.eventId,
      signatureValid: verification.valid,
      rawPayload: safeJsonParse(rawBody),
    });
    return { ok: false, httpStatus: 404, error: "Transaction introuvable" };
  }

  const { alreadyProcessed } = await recordWebhookEvent({
    transactionId: transaction.id,
    provider: providerKey,
    eventId: verification.eventId,
    signatureValid: verification.valid,
    rawPayload: safeJsonParse(rawBody),
  });
  if (alreadyProcessed) {
    return { ok: true };
  }

  if (!amountAndCurrencyMatch(transaction, verification)) {
    await updateTransactionStatus(transaction.id, "FAILED", {
      failureReason: "Montant ou devise ne correspond pas à la transaction initiée",
    });
    logPaymentEvent("payment_failed", {
      reference: transaction.reference,
      transactionId: transaction.id,
      garageId: transaction.garageId,
      provider: providerKey,
      reason: "amount_or_currency_mismatch",
    });
    return { ok: false, httpStatus: 400, error: "Montant ou devise incohérent" };
  }

  let finalStatus = verification.status;

  // Défense en profondeur : un SUCCESS annoncé par le webhook n'est crédité
  // qu'après confirmation indépendante par un appel serveur-à-serveur vers
  // PayDunya (ou tout adaptateur l'implémentant) — jamais sur la seule foi
  // du contenu POSTé sur notre URL de callback.
  if (finalStatus === "SUCCESS" && adapter.confirmPayment) {
    try {
      const confirmed = await adapter.confirmPayment(verification.externalReference);
      if (confirmed.status !== "SUCCESS") {
        finalStatus = "FAILED";
        await updateTransactionStatus(transaction.id, "FAILED", {
          failureReason: "La vérification active auprès du prestataire n'a pas confirmé le succès",
        });
        logPaymentEvent("payment_failed", {
          reference: transaction.reference,
          transactionId: transaction.id,
          garageId: transaction.garageId,
          provider: providerKey,
          reason: "active_confirmation_mismatch",
        });
        return { ok: false, httpStatus: 400, error: "Confirmation du paiement échouée" };
      }
    } catch {
      // Le webhook reste valide (hash + montant/devise déjà vérifiés) même
      // si l'appel de confirmation active échoue techniquement (réseau,
      // indisponibilité PayDunya) — on ne bloque pas un paiement légitime
      // pour une panne de vérification secondaire, mais on le journalise.
      logPaymentEvent("payment_callback_received", {
        reference: transaction.reference,
        transactionId: transaction.id,
        garageId: transaction.garageId,
        provider: providerKey,
        reason: "active_confirmation_unreachable",
      });
    }
  }

  await updateTransactionStatus(transaction.id, finalStatus, {
    externalReference: verification.externalReference,
  });

  const eventByStatus: Record<string, "payment_success" | "payment_failed" | "payment_cancelled"> = {
    SUCCESS: "payment_success",
    FAILED: "payment_failed",
    CANCELLED: "payment_cancelled",
  };
  const logEvent = eventByStatus[finalStatus];
  if (logEvent) {
    logPaymentEvent(logEvent, {
      reference: transaction.reference,
      transactionId: transaction.id,
      garageId: transaction.garageId,
      provider: providerKey,
    });
  }

  return { ok: true };
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}
