import type { PaymentChannel } from "@/app/generated/prisma/client";

/**
 * Référence pays → devise → opérateurs mobile money disponibles.
 *
 * `paydunyaConfidence` reflète notre niveau de confiance (recherches
 * croisées, documentation PayDunya officielle inaccessible directement à
 * nos outils) que PayDunya couvre réellement ce marché :
 *   - "confirmed" : plusieurs sources concordantes (Sénégal, Côte d'Ivoire,
 *     Bénin, Burkina Faso, Togo, Mali — zone UEMOA/XOF).
 *   - "unverified" : présent dans notre liste de pays cibles mais couverture
 *     PayDunya non confirmée — À VÉRIFIER dans votre dashboard PayDunya
 *     avant de promettre ce pays à un client. Ces pays restent listés
 *     (choix explicite) mais leurs canaux mobile money sont routés vers
 *     l'adaptateur Flutterwave (NOT_CONFIGURED) tant qu'aucun prestataire
 *     réel ne les couvre (voir lib/payments/registry.ts).
 */
export type CountryConfig = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  flag: string;
  currency: string; // ISO 4217
  channels: PaymentChannel[];
  paydunyaConfidence: "confirmed" | "unverified";
};

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  { code: "SN", name: "Sénégal", flag: "🇸🇳", currency: "XOF", channels: ["ORANGE_MONEY", "WAVE", "FREE_MONEY"], paydunyaConfidence: "confirmed" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", currency: "XOF", channels: ["ORANGE_MONEY", "MTN_MOMO", "MOOV_MONEY", "WAVE"], paydunyaConfidence: "confirmed" },
  { code: "ML", name: "Mali", flag: "🇲🇱", currency: "XOF", channels: ["ORANGE_MONEY", "MOOV_MONEY"], paydunyaConfidence: "confirmed" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", currency: "XOF", channels: ["ORANGE_MONEY", "MOOV_MONEY"], paydunyaConfidence: "confirmed" },
  { code: "BJ", name: "Bénin", flag: "🇧🇯", currency: "XOF", channels: ["MTN_MOMO", "MOOV_MONEY"], paydunyaConfidence: "confirmed" },
  { code: "TG", name: "Togo", flag: "🇹🇬", currency: "XOF", channels: ["MOOV_MONEY"], paydunyaConfidence: "confirmed" },
  { code: "CM", name: "Cameroun", flag: "🇨🇲", currency: "XAF", channels: ["ORANGE_MONEY", "MTN_MOMO"], paydunyaConfidence: "unverified" },
  { code: "GN", name: "Guinée", flag: "🇬🇳", currency: "GNF", channels: ["ORANGE_MONEY", "MTN_MOMO"], paydunyaConfidence: "unverified" },
  { code: "CD", name: "RDC", flag: "🇨🇩", currency: "CDF", channels: ["ORANGE_MONEY", "AIRTEL_MONEY", "MPESA", "MTN_MOMO"], paydunyaConfidence: "unverified" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", currency: "KES", channels: ["MPESA", "AIRTEL_MONEY"], paydunyaConfidence: "unverified" },
  { code: "TZ", name: "Tanzanie", flag: "🇹🇿", currency: "TZS", channels: ["MPESA", "AIRTEL_MONEY"], paydunyaConfidence: "unverified" },
  { code: "UG", name: "Ouganda", flag: "🇺🇬", currency: "UGX", channels: ["MTN_MOMO", "AIRTEL_MONEY"], paydunyaConfidence: "unverified" },
];

export const CHANNEL_LABELS: Record<PaymentChannel, string> = {
  ORANGE_MONEY: "Orange Money",
  MTN_MOMO: "MTN Mobile Money",
  MOOV_MONEY: "Moov Money",
  WAVE: "Wave",
  FREE_MONEY: "Free Money",
  AIRTEL_MONEY: "Airtel Money",
  MPESA: "M-Pesa",
  CARD: "Carte bancaire",
};

export function getCountry(code: string): CountryConfig | undefined {
  return SUPPORTED_COUNTRIES.find((c) => c.code === code);
}

export function isChannelAvailable(countryCode: string, channel: PaymentChannel): boolean {
  return getCountry(countryCode)?.channels.includes(channel) ?? false;
}
