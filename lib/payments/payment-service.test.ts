import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAdapter = {
  providerName: "PAYDUNYA" as const,
  isConfigured: vi.fn(() => true),
  initiatePayment: vi.fn(),
  parseWebhook: vi.fn(),
  confirmPayment: vi.fn(),
};

vi.mock("./registry", () => ({
  getAdapterByProviderName: vi.fn(() => mockAdapter),
  getAdapterForChannel: vi.fn(() => mockAdapter),
}));

const db = {
  findTransactionByReference: vi.fn(),
  findTransactionByExternalReference: vi.fn(),
  recordWebhookEvent: vi.fn(),
  updateTransactionStatus: vi.fn(),
  createPendingTransaction: vi.fn(),
};

vi.mock("@/lib/db/payments", () => db);

const { processProviderWebhook, initiateMobileMoneyPayment } = await import("./payment-service");
const { PaymentProviderNotConfiguredError } = await import("./types");

const TRANSACTION = {
  id: "txn_1",
  garageId: "garage_1",
  reference: "GP-ref-1",
  amount: 9500,
  currency: "XOF",
  status: "PENDING",
};

function verification(overrides: Partial<Parameters<typeof mockAdapter.parseWebhook>[0]> = {}) {
  return {
    valid: true,
    eventId: "GP-ref-1:completed",
    externalReference: "GP-ref-1",
    status: "SUCCESS" as const,
    amount: 9500,
    currency: "XOF",
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockAdapter.isConfigured.mockReturnValue(true);
  mockAdapter.confirmPayment.mockResolvedValue({ status: "SUCCESS" });
  db.findTransactionByReference.mockResolvedValue(TRANSACTION);
  db.findTransactionByExternalReference.mockResolvedValue(null);
  db.recordWebhookEvent.mockResolvedValue({ alreadyProcessed: false });
  db.updateTransactionStatus.mockResolvedValue({ ...TRANSACTION, status: "SUCCESS" });
  db.createPendingTransaction.mockResolvedValue(TRANSACTION);
});

describe("processProviderWebhook", () => {
  it("confirms a matching successful payment", async () => {
    mockAdapter.parseWebhook.mockResolvedValue(verification());

    const result = await processProviderWebhook("paydunya", "raw-body", new Headers());

    expect(result).toEqual({ ok: true });
    expect(db.updateTransactionStatus).toHaveBeenCalledWith(
      "txn_1",
      "SUCCESS",
      expect.objectContaining({ externalReference: "GP-ref-1" })
    );
  });

  it("rejects and never processes an unknown/unconfigured provider", async () => {
    const registry = await import("./registry");
    vi.mocked(registry.getAdapterByProviderName).mockReturnValueOnce(null);

    const result = await processProviderWebhook("cinetpay", "raw-body", new Headers());

    expect(result).toEqual({ ok: false, httpStatus: 503, error: "Prestataire non configuré" });
    expect(db.updateTransactionStatus).not.toHaveBeenCalled();
  });

  it("rejects a webhook whose authenticity check fails (invalid hash/signature)", async () => {
    mockAdapter.parseWebhook.mockResolvedValue(verification({ valid: false }));

    const result = await processProviderWebhook("paydunya", "raw-body", new Headers());

    expect(result).toEqual({ ok: false, httpStatus: 400, error: "Signature invalide" });
    expect(db.updateTransactionStatus).not.toHaveBeenCalled();
  });

  it("returns 404 and does not create a transaction when the reference is unknown", async () => {
    db.findTransactionByReference.mockResolvedValue(null);
    db.findTransactionByExternalReference.mockResolvedValue(null);
    mockAdapter.parseWebhook.mockResolvedValue(verification());

    const result = await processProviderWebhook("paydunya", "raw-body", new Headers());

    expect(result).toEqual({ ok: false, httpStatus: 404, error: "Transaction introuvable" });
    expect(db.updateTransactionStatus).not.toHaveBeenCalled();
  });

  it("rejects a webhook reporting a different amount than what was initiated (marks FAILED)", async () => {
    mockAdapter.parseWebhook.mockResolvedValue(verification({ amount: 1 }));

    const result = await processProviderWebhook("paydunya", "raw-body", new Headers());

    expect(result).toEqual({ ok: false, httpStatus: 400, error: "Montant ou devise incohérent" });
    expect(db.updateTransactionStatus).toHaveBeenCalledWith(
      "txn_1",
      "FAILED",
      expect.objectContaining({ failureReason: expect.any(String) })
    );
  });

  it("rejects a webhook reporting a different currency than what was initiated (marks FAILED)", async () => {
    mockAdapter.parseWebhook.mockResolvedValue(verification({ currency: "EUR" }));

    const result = await processProviderWebhook("paydunya", "raw-body", new Headers());

    expect(result).toEqual({ ok: false, httpStatus: 400, error: "Montant ou devise incohérent" });
    expect(db.updateTransactionStatus).toHaveBeenCalledWith("txn_1", "FAILED", expect.any(Object));
  });

  it("processes a genuinely cancelled/failed payment as a normal, matched status update", async () => {
    mockAdapter.parseWebhook.mockResolvedValue(verification({ status: "CANCELLED" }));

    const result = await processProviderWebhook("paydunya", "raw-body", new Headers());

    expect(result).toEqual({ ok: true });
    expect(db.updateTransactionStatus).toHaveBeenCalledWith(
      "txn_1",
      "CANCELLED",
      expect.any(Object)
    );
  });

  it("does not process the same webhook notification twice (idempotency)", async () => {
    mockAdapter.parseWebhook.mockResolvedValue(verification());
    db.recordWebhookEvent.mockResolvedValue({ alreadyProcessed: true });

    const result = await processProviderWebhook("paydunya", "raw-body", new Headers());

    expect(result).toEqual({ ok: true });
    expect(db.updateTransactionStatus).not.toHaveBeenCalled();
  });

  it("rejects when the resolved adapter is configured=false at parse time", async () => {
    mockAdapter.isConfigured.mockReturnValue(false);

    const result = await processProviderWebhook("paydunya", "raw-body", new Headers());

    expect(result).toEqual({ ok: false, httpStatus: 503, error: "Prestataire non configuré" });
    expect(mockAdapter.parseWebhook).not.toHaveBeenCalled();
  });

  describe("active confirmation (defense in depth)", () => {
    it("does not credit SUCCESS if the provider's own server disagrees when actively queried", async () => {
      mockAdapter.parseWebhook.mockResolvedValue(verification());
      mockAdapter.confirmPayment.mockResolvedValue({ status: "PENDING" });

      const result = await processProviderWebhook("paydunya", "raw-body", new Headers());

      expect(result).toEqual({ ok: false, httpStatus: 400, error: "Confirmation du paiement échouée" });
      expect(db.updateTransactionStatus).toHaveBeenCalledWith(
        "txn_1",
        "FAILED",
        expect.objectContaining({ failureReason: expect.any(String) })
      );
    });

    it("still credits a legitimate SUCCESS when active confirmation is unreachable (network failure)", async () => {
      mockAdapter.parseWebhook.mockResolvedValue(verification());
      mockAdapter.confirmPayment.mockRejectedValue(new Error("network down"));

      const result = await processProviderWebhook("paydunya", "raw-body", new Headers());

      expect(result).toEqual({ ok: true });
      expect(db.updateTransactionStatus).toHaveBeenCalledWith(
        "txn_1",
        "SUCCESS",
        expect.any(Object)
      );
    });

    it("does not call active confirmation for non-SUCCESS statuses", async () => {
      mockAdapter.parseWebhook.mockResolvedValue(verification({ status: "PENDING" }));

      await processProviderWebhook("paydunya", "raw-body", new Headers());

      expect(mockAdapter.confirmPayment).not.toHaveBeenCalled();
    });
  });
});

describe("initiateMobileMoneyPayment", () => {
  const PARAMS = {
    channel: "ORANGE_MONEY" as const,
    countryCode: "SN",
    currency: "XOF",
    amount: 9500,
    phoneNumber: "771234567",
    planTier: "PRO" as const,
  };

  it("creates a pending transaction and returns the redirect URL on success", async () => {
    mockAdapter.initiatePayment.mockResolvedValue({
      externalReference: "ext-token-1",
      status: "PENDING",
      redirectUrl: "https://app.paydunya.com/sandbox-checkout/invoice/ext-token-1",
    });

    const result = await initiateMobileMoneyPayment("garage_1", PARAMS);

    expect(db.createPendingTransaction).toHaveBeenCalledWith(
      "garage_1",
      expect.objectContaining({ amount: 9500, currency: "XOF" })
    );
    expect(result.redirectUrl).toBe("https://app.paydunya.com/sandbox-checkout/invoice/ext-token-1");
    expect(db.updateTransactionStatus).toHaveBeenCalledWith(
      TRANSACTION.id,
      "PENDING",
      expect.objectContaining({ externalReference: "ext-token-1" })
    );
  });

  it("marks the transaction FAILED and rethrows when the provider is not configured", async () => {
    mockAdapter.initiatePayment.mockRejectedValue(new PaymentProviderNotConfiguredError("PayDunya"));

    await expect(initiateMobileMoneyPayment("garage_1", PARAMS)).rejects.toThrow(
      /n'est configuré/
    );
    expect(db.updateTransactionStatus).toHaveBeenCalledWith(
      TRANSACTION.id,
      "FAILED",
      expect.objectContaining({ failureReason: expect.any(String) })
    );
  });

  it("marks the transaction FAILED and rethrows on a generic PayDunya API error", async () => {
    mockAdapter.initiatePayment.mockRejectedValue(
      new Error("Échec de création de la facture PayDunya.")
    );

    await expect(initiateMobileMoneyPayment("garage_1", PARAMS)).rejects.toThrow(
      "Échec de création de la facture PayDunya."
    );
    expect(db.updateTransactionStatus).toHaveBeenCalledWith(
      TRANSACTION.id,
      "FAILED",
      expect.objectContaining({ failureReason: "Échec de création de la facture PayDunya." })
    );
  });
});
