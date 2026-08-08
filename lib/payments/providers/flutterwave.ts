import type {
  MobileMoneyAdapter,
  InitiatePaymentRequest,
  InitiatePaymentResult,
  WebhookVerificationResult,
} from "../types";
import { PaymentProviderNotConfiguredError } from "../types";
import { isFlutterwaveConfigured } from "../config";

/**
 * Flutterwave — architecture préparée, aucune implémentation réelle tant
 * qu'aucun compte/clé n'existe. Ne simule jamais un paiement réussi. Pour
 * activer réellement : implémenter initiatePayment/parseWebhook contre la
 * documentation officielle Flutterwave (non consultée à ce stade, aucune
 * clé n'étant disponible pour la tester).
 */
export class FlutterwaveAdapter implements MobileMoneyAdapter {
  readonly providerName = "FLUTTERWAVE" as const;

  isConfigured(): boolean {
    return isFlutterwaveConfigured();
  }

  async initiatePayment(_req: InitiatePaymentRequest): Promise<InitiatePaymentResult> {
    throw new PaymentProviderNotConfiguredError(
      "Flutterwave n'est pas encore configuré (NOT_CONFIGURED)"
    );
  }

  async parseWebhook(_rawBody: string, _headers: Headers): Promise<WebhookVerificationResult> {
    throw new PaymentProviderNotConfiguredError("Flutterwave n'est pas encore configuré");
  }
}
