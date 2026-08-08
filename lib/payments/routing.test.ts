import { describe, it, expect } from "vitest";
import { getPreferredProvider } from "./routing";

describe("getPreferredProvider", () => {
  it("prefers PayDunya for XOF, PayDunya's only confirmed currency", () => {
    expect(getPreferredProvider("XOF")).toBe("PAYDUNYA");
  });

  it("prefers Stripe for every other currency", () => {
    expect(getPreferredProvider("EUR")).toBe("STRIPE");
    expect(getPreferredProvider("USD")).toBe("STRIPE");
    expect(getPreferredProvider("XAF")).toBe("STRIPE"); // zone voisine mais non confirmée pour PayDunya
  });
});
