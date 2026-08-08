import { scopedPrisma } from "@/lib/prisma";

export async function listInvoices(garageId: string) {
  const db = scopedPrisma(garageId);
  return db.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });
}

export async function getInvoice(garageId: string, id: string) {
  const db = scopedPrisma(garageId);
  return db.invoice.findFirst({
    where: { id },
    include: { client: true, lineItems: true, repairOrder: true },
  });
}

export async function markInvoicePaid(garageId: string, id: string) {
  const db = scopedPrisma(garageId);
  return db.invoice.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });
}
