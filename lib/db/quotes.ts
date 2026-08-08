import { prisma, scopedPrisma } from "@/lib/prisma";
import { calculateDocumentTotals, lineTotal } from "@/lib/invoicing/calculate";
import type { DocumentInput } from "@/lib/validations/quotes";

export async function listQuotes(garageId: string) {
  const db = scopedPrisma(garageId);
  return db.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });
}

export async function getQuote(garageId: string, id: string) {
  const db = scopedPrisma(garageId);
  return db.quote.findFirst({
    where: { id },
    include: { client: true, lineItems: true, repairOrder: true, invoice: true },
  });
}

export async function createQuote(garageId: string, data: DocumentInput) {
  const settings = await prisma.garageSettings.findUniqueOrThrow({
    where: { garageId },
  });

  const client = await prisma.client.findFirst({ where: { id: data.clientId, garageId } });
  if (!client) throw new Error("Client introuvable");

  const totals = calculateDocumentTotals({
    laborHours: data.laborHours,
    hourlyRate: settings.hourlyLaborRate,
    taxRatePercent: settings.taxRatePercent,
    lineItems: data.lineItems,
  });

  return prisma.$transaction(async (tx) => {
    const updated = await tx.garageSettings.update({
      where: { garageId },
      data: { nextQuoteNumber: { increment: 1 } },
    });
    const number = `${settings.quotePrefix}${new Date().getFullYear()}-${String(
      updated.nextQuoteNumber - 1
    ).padStart(4, "0")}`;

    return tx.quote.create({
      data: {
        garageId,
        number,
        clientId: data.clientId,
        repairOrderId: data.repairOrderId || null,
        status: "DRAFT",
        laborHours: data.laborHours,
        laborRateSnapshot: settings.hourlyLaborRate,
        subtotal: totals.subtotal,
        taxRateSnapshot: settings.taxRatePercent,
        taxAmount: totals.taxAmount,
        total: totals.total,
        lineItems: {
          create: data.lineItems.map((li) => ({
            description: li.description,
            quantity: li.quantity,
            unitPrice: li.unitPrice,
            lineTotal: lineTotal(li.quantity, li.unitPrice),
            inventoryItemId: li.inventoryItemId || null,
          })),
        },
      },
      include: { lineItems: true },
    });
  });
}

export async function updateQuoteStatus(garageId: string, id: string, status: string) {
  const db = scopedPrisma(garageId);
  return db.quote.update({ where: { id }, data: { status: status as never } });
}

/**
 * Convertit un devis ACCEPTED en facture (transaction) : copie les lignes,
 * fige le devis (via la relation 1:1 `sourceQuote` sur Invoice).
 */
export async function convertQuoteToInvoice(garageId: string, quoteId: string) {
  const settings = await prisma.garageSettings.findUniqueOrThrow({ where: { garageId } });
  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, garageId },
    include: { lineItems: true },
  });
  if (!quote) throw new Error("Devis introuvable");
  if (quote.status !== "ACCEPTED") {
    throw new Error("Seul un devis accepté peut être converti en facture");
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.garageSettings.update({
      where: { garageId },
      data: { nextInvoiceNumber: { increment: 1 } },
    });
    const number = `${settings.invoicePrefix}${new Date().getFullYear()}-${String(
      updated.nextInvoiceNumber - 1
    ).padStart(4, "0")}`;

    return tx.invoice.create({
      data: {
        garageId,
        number,
        clientId: quote.clientId,
        repairOrderId: quote.repairOrderId,
        sourceQuoteId: quote.id,
        status: "DRAFT",
        laborHours: quote.laborHours,
        laborRateSnapshot: quote.laborRateSnapshot,
        subtotal: quote.subtotal,
        taxRateSnapshot: quote.taxRateSnapshot,
        taxAmount: quote.taxAmount,
        total: quote.total,
        lineItems: {
          create: quote.lineItems.map((li) => ({
            description: li.description,
            quantity: li.quantity,
            unitPrice: li.unitPrice,
            lineTotal: li.lineTotal,
            inventoryItemId: li.inventoryItemId,
          })),
        },
      },
      include: { lineItems: true },
    });
  });
}
