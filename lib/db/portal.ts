import { scopedPrisma } from "@/lib/prisma";

/**
 * Requêtes du portail client — toujours doublement filtrées (garageId via
 * scopedPrisma + clientId explicite) puisqu'un compte CLIENT ne doit voir
 * que ses propres données, un sous-ensemble plus étroit que le tenant entier.
 */

export async function listMyVehicles(garageId: string, clientId: string) {
  const db = scopedPrisma(garageId);
  return db.vehicle.findMany({
    where: { clientId },
    include: { repairOrders: { orderBy: { createdAt: "desc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyRepairOrder(garageId: string, clientId: string, id: string) {
  const db = scopedPrisma(garageId);
  const order = await db.repairOrder.findFirst({
    where: { id },
    include: { vehicle: true, photos: { orderBy: { uploadedAt: "desc" } } },
  });
  if (!order || order.vehicle.clientId !== clientId) return null;
  return order;
}

export async function listMyQuotes(garageId: string, clientId: string) {
  const db = scopedPrisma(garageId);
  return db.quote.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMyQuote(garageId: string, clientId: string, id: string) {
  const db = scopedPrisma(garageId);
  const quote = await db.quote.findFirst({ where: { id }, include: { lineItems: true } });
  if (!quote || quote.clientId !== clientId) return null;
  return quote;
}

export async function listMyInvoices(garageId: string, clientId: string) {
  const db = scopedPrisma(garageId);
  return db.invoice.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
  });
}

export async function respondToQuote(
  garageId: string,
  clientId: string,
  quoteId: string,
  status: "ACCEPTED" | "REFUSED"
) {
  const db = scopedPrisma(garageId);
  const quote = await db.quote.findFirst({ where: { id: quoteId } });
  if (!quote || quote.clientId !== clientId) throw new Error("Devis introuvable");
  if (quote.status !== "DRAFT" && quote.status !== "SENT") {
    throw new Error("Ce devis ne peut plus être modifié");
  }
  return db.quote.update({ where: { id: quoteId }, data: { status } });
}
