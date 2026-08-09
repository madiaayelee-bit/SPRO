import { describe, it, expect } from "vitest";
import { createHash } from "crypto";
import {
  mapPayDunyaStatus,
  computeExpectedPayDunyaHash,
  PAYDUNYA_SUPPORTED_COUNTRIES,
  PAYDUNYA_CURRENCY,
} from "./paydunya";

describe("mapPayDunyaStatus", () => {
  it("maps PayDunya's documented statuses to our internal statuses", () => {
    expect(mapPayDunyaStatus("completed")).toBe("SUCCESS");
    expect(mapPayDunyaStatus("pending")).toBe("PENDING");
    // Orthographe confirmée dans le SDK officiel PayDunya : "canceled" (un
    // seul "l", américain) et "fail" (pas "failed").
    expect(mapPayDunyaStatus("canceled")).toBe("CANCELLED");
    expect(mapPayDunyaStatus("fail")).toBe("FAILED");
  });

  it("accepts alternate cancelled/failed spellings for compatibility", () => {
    expect(mapPayDunyaStatus("cancelled")).toBe("CANCELLED");
    expect(mapPayDunyaStatus("failed")).toBe("FAILED");
  });

  it("defaults unknown or missing statuses to FAILED rather than trusting an unrecognized value", () => {
    expect(mapPayDunyaStatus("something-unexpected")).toBe("FAILED");
    expect(mapPayDunyaStatus(undefined)).toBe("FAILED");
    expect(mapPayDunyaStatus("")).toBe("FAILED");
  });
});

describe("computeExpectedPayDunyaHash", () => {
  it("matches SHA-512(masterKey) as documented by PayDunya", () => {
    const masterKey = "test-master-key";
    const expected = createHash("sha512").update(masterKey).digest("hex");
    expect(computeExpectedPayDunyaHash(masterKey)).toBe(expected);
  });

  it("produces a different hash for a different key (rejects a forged signature)", () => {
    const real = computeExpectedPayDunyaHash("real-key");
    const forged = computeExpectedPayDunyaHash("wrong-key");
    expect(real).not.toBe(forged);
  });
});

describe("PayDunya country/currency scope", () => {
  it("only covers the markets confirmed by research (UEMOA/XOF zone)", () => {
    expect([...PAYDUNYA_SUPPORTED_COUNTRIES].sort()).toEqual(
      ["BF", "BJ", "CI", "ML", "SN", "TG"].sort()
    );
  });

  it("does not include markets outside the confirmed coverage", () => {
    expect(PAYDUNYA_SUPPORTED_COUNTRIES.has("KE")).toBe(false);
    expect(PAYDUNYA_SUPPORTED_COUNTRIES.has("CM")).toBe(false);
  });

  it("only operates in XOF", () => {
    expect(PAYDUNYA_CURRENCY).toBe("XOF");
  });
});
