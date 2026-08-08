import { PAYDUNYA_CURRENCY } from "./providers/paydunya";

export type PreferredProvider = "PAYDUNYA" | "STRIPE";

/**
 * Règle de routage unique — à modifier ici uniquement si de nouveaux
 * prestataires ou zones de couverture doivent être pris en compte.
 *
 * PayDunya n'opère que dans la zone XOF/UEMOA confirmée
 * (voir PAYDUNYA_SUPPORTED_COUNTRIES) : toute autre devise revient à Stripe.
 * Les deux moyens de paiement restent utilisables manuellement quel que soit
 * le résultat — cette fonction ne fait que déterminer lequel est mis en avant
 * par défaut.
 */
export function getPreferredProvider(currency: string): PreferredProvider {
  return currency === PAYDUNYA_CURRENCY ? "PAYDUNYA" : "STRIPE";
}
