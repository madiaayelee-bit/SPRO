import { describe, it, expect } from "vitest";
import { isValidTransition } from "./status-transitions";

describe("isValidTransition", () => {
  it("allows PENDING to move to any of the documented next states", () => {
    expect(isValidTransition("PENDING", "PROCESSING")).toBe(true);
    expect(isValidTransition("PENDING", "SUCCESS")).toBe(true);
    expect(isValidTransition("PENDING", "FAILED")).toBe(true);
    expect(isValidTransition("PENDING", "CANCELLED")).toBe(true);
    expect(isValidTransition("PENDING", "EXPIRED")).toBe(true);
  });

  it("allows PROCESSING to resolve to a terminal state", () => {
    expect(isValidTransition("PROCESSING", "SUCCESS")).toBe(true);
    expect(isValidTransition("PROCESSING", "FAILED")).toBe(true);
    expect(isValidTransition("PROCESSING", "EXPIRED")).toBe(true);
  });

  it("allows SUCCESS to move to REFUNDED only", () => {
    expect(isValidTransition("SUCCESS", "REFUNDED")).toBe(true);
    expect(isValidTransition("SUCCESS", "FAILED")).toBe(false);
    expect(isValidTransition("SUCCESS", "PENDING")).toBe(false);
  });

  it("never allows a terminal failure/cancel/expiry state to change again", () => {
    expect(isValidTransition("FAILED", "SUCCESS")).toBe(false);
    expect(isValidTransition("CANCELLED", "SUCCESS")).toBe(false);
    expect(isValidTransition("EXPIRED", "SUCCESS")).toBe(false);
    expect(isValidTransition("REFUNDED", "SUCCESS")).toBe(false);
  });

  it("treats a same-state transition as valid (idempotent no-op)", () => {
    expect(isValidTransition("SUCCESS", "SUCCESS")).toBe(true);
    expect(isValidTransition("PENDING", "PENDING")).toBe(true);
  });

  it("never allows skipping backwards from PROCESSING to PENDING", () => {
    expect(isValidTransition("PROCESSING", "PENDING")).toBe(false);
  });
});
