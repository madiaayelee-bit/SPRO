import { randomUUID } from "crypto";
import { prisma, scopedPrisma } from "@/lib/prisma";
import { isValidTransition } from "@/lib/payments/status-transitions";
import type {
  PaymentChannel,
  PaymentProviderName,
  PaymentStatus,
  PlanTier,
} from "@/app/generated/prisma/client";

export function generatePaymentReference() {
  return `GP-${randomUUID()}`;
}

export async function createPendingTransaction(
  garageId: string,
  data: {
    provider: PaymentProviderName;
    channel: PaymentChannel;
    countryCode?: string;
    currency: string;
    amount: number;
    phoneNumber?: string;
    planTier?: PlanTier;
  }
) {
  const db = scopedPrisma(garageId);
  return db.paymentTransaction.create({
    data: {
      garageId,
      reference: generatePaymentReference(),
      provider: data.provider,
      channel: data.channel,
      countryCode: data.countryCode,
      currency: data.currency,
      amount: data.amount,
      phoneNumber: data.phoneNumber,
      planTier: data.planTier,
      status: "PENDING",
    },
  });
}

export async function listPaymentTransactions(garageId: string) {
  const db = scopedPrisma(garageId);
  return db.paymentTransaction.findMany({ orderBy: { initiatedAt: "desc" } });
}

export async function getPaymentTransaction(garageId: string, id: string) {
  const db = scopedPrisma(garageId);
  return db.paymentTransaction.findFirst({ where: { id } });
}

export class InvalidPaymentTransitionError extends Error {
  constructor(from: PaymentStatus, to: PaymentStatus) {
    super(`Transition de statut invalide : ${from} → ${to}`);
    this.name = "InvalidPaymentTransitionError";
  }
}

/**
 * Met à jour le statut d'une transaction en base — jamais appelé depuis une
 * action déclenchée par le frontend, uniquement depuis le traitement serveur
 * d'un webhook (ou d'une vérification active auprès du prestataire).
 */
export async function updateTransactionStatus(
  transactionId: string,
  newStatus: PaymentStatus,
  extra: { externalReference?: string; failureReason?: string } = {}
) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.paymentTransaction.findUniqueOrThrow({
      where: { id: transactionId },
    });

    if (current.status === newStatus) {
      return current; // déjà dans cet état — traitement idempotent, pas une erreur
    }

    if (!isValidTransition(current.status, newStatus)) {
      throw new InvalidPaymentTransitionError(current.status, newStatus);
    }

    return tx.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: newStatus,
        externalReference: extra.externalReference ?? current.externalReference,
        failureReason: extra.failureReason,
        confirmedAt: newStatus === "SUCCESS" ? new Date() : current.confirmedAt,
      },
    });
  });
}

export async function findTransactionByReference(reference: string) {
  return prisma.paymentTransaction.findUnique({ where: { reference } });
}

export async function findTransactionByExternalReference(externalReference: string) {
  return prisma.paymentTransaction.findFirst({ where: { externalReference } });
}

/**
 * Journalise un événement webhook et signale s'il a déjà été traité — la
 * contrainte unique (provider, eventId) empêche tout traitement en double
 * même en cas de livraison répétée par le prestataire.
 */
export async function recordWebhookEvent(params: {
  transactionId: string | null;
  provider: string;
  eventId: string;
  signatureValid: boolean;
  rawPayload: unknown;
}): Promise<{ alreadyProcessed: boolean }> {
  try {
    await prisma.paymentWebhookEvent.create({
      data: {
        transactionId: params.transactionId,
        provider: params.provider as never,
        eventId: params.eventId,
        signatureValid: params.signatureValid,
        rawPayload: params.rawPayload as never,
      },
    });
    return { alreadyProcessed: false };
  } catch (err) {
    // Violation de la contrainte unique (provider, eventId) = déjà traité.
    if (err instanceof Error && "code" in err && (err as { code?: string }).code === "P2002") {
      return { alreadyProcessed: true };
    }
    throw err;
  }
}
