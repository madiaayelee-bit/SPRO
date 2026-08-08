import { describe, it, expect } from "vitest";
import { amountAndCurrencyMatch, belongsToGarage } from "./verify";

describe("amountAndCurrencyMatch", () => {
  it("matches when amount and currency are identical", () => {
    const transaction = { amount: 19000, currency: "XOF" };
    const verification = { amount: 19000, currency: "XOF" };
    expect(amountAndCurrencyMatch(transaction, verification)).toBe(true);
  });

  it("rejects a webhook reporting a different amount than what was initiated", () => {
    const transaction = { amount: 19000, currency: "XOF" };
    const verification = { amount: 1, currency: "XOF" }; // ex: montant manipulé
    expect(amountAndCurrencyMatch(transaction, verification)).toBe(false);
  });

  it("rejects a webhook reporting a different currency than what was initiated", () => {
    const transaction = { amount: 19000, currency: "XOF" };
    const verification = { amount: 19000, currency: "EUR" };
    expect(amountAndCurrencyMatch(transaction, verification)).toBe(false);
  });

  it("compares the transaction's Decimal-like amount by numeric value, not by type", () => {
    // Prisma renvoie un objet Decimal, pas un number brut — la comparaison
    // doit passer par Number() plutôt qu'une égalité stricte de type.
    const decimalLike = { toString: () => "19000" };
    const transaction = { amount: decimalLike, currency: "XOF" };
    const verification = { amount: 19000, currency: "XOF" };
    expect(amountAndCurrencyMatch(transaction, verification)).toBe(true);
  });
});

describe("belongsToGarage", () => {
  it("confirms a transaction belonging to the requesting garage", () => {
    expect(belongsToGarage({ garageId: "garage_A" }, "garage_A")).toBe(true);
  });

  it("rejects a transaction belonging to a different garage (cross-tenant guard)", () => {
    expect(belongsToGarage({ garageId: "garage_B" }, "garage_A")).toBe(false);
  });

  it("rejects a missing transaction rather than throwing", () => {
    expect(belongsToGarage(null, "garage_A")).toBe(false);
    expect(belongsToGarage(undefined, "garage_A")).toBe(false);
  });
});
