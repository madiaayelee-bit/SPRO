/**
 * Le webhook ne doit jamais faire confiance à un montant/devise annoncés
 * sans les comparer à ce qui a été enregistré à l'initiation. Fonction pure
 * — aucune dépendance base de données, pour rester testable en isolation.
 */
export function amountAndCurrencyMatch(
  transaction: { amount: unknown; currency: string },
  verification: { amount: number; currency: string }
): boolean {
  return (
    Number(transaction.amount) === verification.amount &&
    transaction.currency === verification.currency
  );
}

/**
 * Garde multi-garage — une transaction ne doit jamais être révélée (statut,
 * montant, reçu...) à un garage autre que celui qui l'a initiée, même si sa
 * référence a été devinée ou passée dans une URL. Fonction pure, testable
 * sans base de données.
 */
export function belongsToGarage<T extends { garageId: string }>(
  transaction: T | null | undefined,
  garageId: string
): transaction is T {
  return Boolean(transaction && transaction.garageId === garageId);
}
