import { createHash } from "crypto";
import type {
  MobileMoneyAdapter,
  InitiatePaymentRequest,
  InitiatePaymentResult,
  WebhookVerificationResult,
} from "../types";
import { PaymentProviderNotConfiguredError } from "../types";
import { isPayDunyaConfigured, getPayDunyaConfig } from "../config";

/**
 * Adaptateur PayDunya — flux "Payment With Redistribution" (checkout-invoice
 * hébergé), le flux que PayDunya présente elle-même comme adapté à la
 * majorité des cas.
 *
 * Le site officiel developers.paydunya.com bloque nos outils de récupération
 * (403, pare-feu anti-bot) ; la structure de requête, les en-têtes
 * d'authentification, les URL (sandbox ET live), le hash de webhook et les
 * valeurs de statut ci-dessous ont tous été confirmés mot pour mot dans le
 * code source des SDK officiels PayDunya sur GitHub
 * (paydunyadev/paydunya-php : paydunya/setup.php et
 * paydunya/checkout/checkout_invoice.php ; paydunyadev/paydunya-node-master :
 * README — consultés le 2026-08-06). Reste propre à VOTRE compte, à vérifier
 * dans le dashboard PayDunya avant mise en production : la liste exacte des
 * opérateurs mobile money réellement actifs.
 *
 * PayDunya ne fournit pas de champ "eventId" dédié dans son callback — la
 * clé d'idempotence utilisée ici (`token:status`) est une construction
 * délibérée, pas un champ de leur API (voir parseWebhook ci-dessous).
 *
 * Défense en profondeur : en plus de vérifier le hash du callback, SUCCESS
 * n'est jamais crédité sur la seule foi du webhook — confirmPayment()
 * interroge activement l'API PayDunya (checkout-invoice/confirm/{token},
 * confirmé dans setup.php) pour faire dire au serveur de PayDunya lui-même,
 * via un appel sortant que personne ne peut falsifier, que la facture est
 * bien "completed" (voir payment-service.ts).
 */

// Marchés confirmés par recherche croisée (zone UEMOA, XOF) — PayDunya ne
// semble pas opérer hors de cette zone. Rejeter explicitement plutôt que de
// tenter un paiement dans un pays non supporté.
export const PAYDUNYA_SUPPORTED_COUNTRIES = new Set(["SN", "CI", "BJ", "BF", "TG", "ML"]);
export const PAYDUNYA_CURRENCY = "XOF";

// Compatibilite PayDunya : accepter les variantes de statut documentees ou observees.
// Annulation : "canceled" ou "cancelled". Echec : "fail" ou "failed".
// Les statuts inconnus restent traites comme FAILED.
const PAYDUNYA_STATUS_MAP: Record<string, WebhookVerificationResult["status"]> = {
  completed: "SUCCESS",
  pending: "PENDING",
  canceled: "CANCELLED",
  cancelled: "CANCELLED",
  fail: "FAILED",
  failed: "FAILED",
};

/** Pure — testable sans réseau ni configuration. */
export function mapPayDunyaStatus(status: string | undefined): WebhookVerificationResult["status"] {
  return (status && PAYDUNYA_STATUS_MAP[status]) || "FAILED";
}

/** Pure — le hash attendu est SHA-512(clé maître), comparé au hash reçu. */
export function computeExpectedPayDunyaHash(masterKey: string): string {
  return createHash("sha512").update(masterKey).digest("hex");
}

function baseUrl(): string {
  const { mode } = getPayDunyaConfig();
  return mode === "live"
    ? "https://app.paydunya.com/api/v1"
    : "https://app.paydunya.com/sandbox-api/v1";
}

function authHeaders(): Record<string, string> {
  const { masterKey, privateKey, token } = getPayDunyaConfig();
  return {
    "Content-Type": "application/json",
    "PAYDUNYA-MASTER-KEY": masterKey,
    "PAYDUNYA-PRIVATE-KEY": privateKey,
    "PAYDUNYA-TOKEN": token,
  };
}

export class PayDunyaAdapter implements MobileMoneyAdapter {
  readonly providerName = "PAYDUNYA" as const;

  isConfigured(): boolean {
    return isPayDunyaConfigured();
  }

  async initiatePayment(req: InitiatePaymentRequest): Promise<InitiatePaymentResult> {
    if (!this.isConfigured()) {
      throw new PaymentProviderNotConfiguredError("PayDunya");
    }
    if (!PAYDUNYA_SUPPORTED_COUNTRIES.has(req.countryCode)) {
      throw new Error(
        `PayDunya ne couvre pas (à notre connaissance) le pays ${req.countryCode}.`
      );
    }
    if (req.currency !== PAYDUNYA_CURRENCY) {
      throw new Error(
        `PayDunya attend un montant en ${PAYDUNYA_CURRENCY}, reçu ${req.currency}.`
      );
    }

    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl()}/checkout-invoice/create`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        invoice: {
          total_amount: req.amount,
          description: req.description,
          custom_data: { reference: req.reference },
        },
        store: { name: "Garage Pro" },
        actions: {
          cancel_url: `${appUrl}/dashboard/parametres/abonnement?paiement=annule`,
          return_url: `${appUrl}/dashboard/parametres/abonnement?paiement=retour&ref=${req.reference}`,
          callback_url: `${appUrl}/api/payments/mobile-money/webhook/paydunya`,
        },
      }),
    });

    const data = (await response.json()) as {
      response_code?: string;
      response_text?: string;
      token?: string;
    };

    if (data.response_code !== "00" || !data.token) {
      throw new Error(data.response_text || "Échec de création de la facture PayDunya.");
    }

    return {
      externalReference: data.token,
      status: "PENDING",
      redirectUrl: data.response_text,
    };
  }

  /**
   * Appel serveur-à-serveur vers PayDunya (GET checkout-invoice/confirm/
   * {token}, confirmé dans le SDK officiel) — indépendant du contenu du
   * webhook reçu, pour ne jamais créditer un paiement sur la seule foi
   * d'une notification qu'un tiers pourrait avoir falsifiée.
   */
  async confirmPayment(token: string): Promise<{ status: WebhookVerificationResult["status"] }> {
    const response = await fetch(`${baseUrl()}/checkout-invoice/confirm/${token}`, {
      method: "GET",
      headers: authHeaders(),
    });
    const data = (await response.json()) as { status?: string };
    return { status: mapPayDunyaStatus(data.status) };
  }

  async parseWebhook(rawBody: string): Promise<WebhookVerificationResult> {
    // PayDunya envoie le callback en application/x-www-form-urlencoded avec
    // un champ "data" contenant un objet JSON.
    const params = new URLSearchParams(rawBody);
    const dataRaw = params.get("data");
    if (!dataRaw) {
      return invalidResult();
    }

    let parsed: {
      status?: string;
      hash?: string;
      invoice?: { token?: string; total_amount?: number };
    };
    try {
      parsed = JSON.parse(dataRaw);
    } catch {
      return invalidResult();
    }

    const { masterKey } = getPayDunyaConfig();
    const expectedHash = computeExpectedPayDunyaHash(masterKey);
    const valid = Boolean(parsed.hash) && parsed.hash === expectedHash;

    const status = mapPayDunyaStatus(parsed.status);
    const token = parsed.invoice?.token ?? "";

    return {
      valid,
      // Pas de champ "eventId" dédié fourni par PayDunya : token+statut sert
      // de clé d'idempotence (une même notification token+statut ne sera
      // traitée qu'une fois ; une transition ultérieure du même token vers
      // un autre statut reste un événement distinct, légitimement traité).
      eventId: `${token}:${status}`,
      externalReference: token,
      status,
      amount: Number(parsed.invoice?.total_amount ?? 0),
      // PayDunya n'expose pas de champ devise distinct dans le callback
      // d'après nos recherches — n'opérant que dans la zone XOF, on
      // applique la devise unique de ses marchés confirmés plutôt que de
      // deviner un champ inexistant.
      currency: PAYDUNYA_CURRENCY,
    };
  }
}

function invalidResult(): WebhookVerificationResult {
  return { valid: false, eventId: "", externalReference: "", status: "FAILED", amount: 0, currency: "" };
}
