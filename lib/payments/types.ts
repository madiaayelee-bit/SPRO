import type { PaymentChannel, PaymentProviderName, PaymentStatus } from "@/app/generated/prisma/client";

export class PaymentProviderNotConfiguredError extends Error {
  constructor(providerHint?: string) {
    super(
      providerHint
        ? `Aucun prestataire de paiement n'est configuré (${providerHint}). Un compte marchand réel doit être ouvert et ses clés API ajoutées avant que les paiements puissent fonctionner.`
        : "Aucun prestataire de paiement n'est configuré."
    );
    this.name = "PaymentProviderNotConfiguredError";
  }
}

export type InitiatePaymentRequest = {
  /** Notre référence interne — générée avant l'appel, sert de clé d'idempotence côté prestataire. */
  reference: string;
  amount: number;
  currency: string;
  countryCode: string;
  channel: PaymentChannel;
  phoneNumber: string;
  description: string;
};

export type InitiatePaymentResult = {
  externalReference: string;
  status: Extract<PaymentStatus, "PENDING" | "PROCESSING">;
  /** URL de paiement hébergée à laquelle rediriger le client. */
  redirectUrl?: string;
};

export type WebhookVerificationResult = {
  valid: boolean;
  eventId: string;
  externalReference: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
};

/**
 * Interface commune à tout prestataire mobile money — un nouveau prestataire
 * s'ajoute en implémentant cette interface dans lib/payments/providers/ et en
 * l'enregistrant dans lib/payments/registry.ts, sans toucher au reste de
 * l'application.
 */
export interface MobileMoneyAdapter {
  readonly providerName: PaymentProviderName;
  isConfigured(): boolean;
  initiatePayment(req: InitiatePaymentRequest): Promise<InitiatePaymentResult>;
  /** Doit vérifier l'authenticité de la requête avant toute confiance dans son contenu. */
  parseWebhook(rawBody: string, headers: Headers): Promise<WebhookVerificationResult>;
  /**
   * Optionnel — vérification active du statut auprès du prestataire
   * (appel serveur-à-serveur, indépendant du contenu du webhook reçu).
   * Utilisé en défense en profondeur avant de créditer un SUCCESS : voir
   * payment-service.ts. Un prestataire sans ce mécanisme se contente de la
   * vérification d'authenticité du webhook lui-même (parseWebhook).
   */
  confirmPayment?(externalReference: string): Promise<{ status: PaymentStatus }>;
}
