import { scopedPrisma } from "@/lib/prisma";
import type { InventoryItemInput } from "@/lib/validations/inventory";

export async function listInventory(garageId: string) {
  const db = scopedPrisma(garageId);
  return db.inventoryItem.findMany({ orderBy: { name: "asc" } });
}

export async function getInventoryItem(garageId: string, id: string) {
  const db = scopedPrisma(garageId);
  return db.inventoryItem.findFirst({ where: { id } });
}

export async function createInventoryItem(garageId: string, data: InventoryItemInput) {
  const db = scopedPrisma(garageId);
  return db.inventoryItem.create({
    data: {
      garageId,
      name: data.name,
      reference: data.reference || null,
      unitPrice: data.unitPrice,
      quantityInStock: data.quantityInStock,
      lowStockThreshold: data.lowStockThreshold,
    },
  });
}

export async function updateInventoryItem(
  garageId: string,
  id: string,
  data: InventoryItemInput
) {
  const db = scopedPrisma(garageId);
  return db.inventoryItem.update({
    where: { id },
    data: {
      name: data.name,
      reference: data.reference || null,
      unitPrice: data.unitPrice,
      quantityInStock: data.quantityInStock,
      lowStockThreshold: data.lowStockThreshold,
    },
  });
}

/**
 * Enregistre l'utilisation d'une pièce sur une réparation : décrémente le
 * stock et fige le prix unitaire du moment (utilisé plus tard par le devis
 * / la facture liée à cette réparation).
 */
export async function recordPartUsage(
  garageId: string,
  repairOrderId: string,
  inventoryItemId: string,
  quantity: number
) {
  const db = scopedPrisma(garageId);

  return db.$transaction(async (tx) => {
    const order = await tx.repairOrder.findFirst({ where: { id: repairOrderId } });
    if (!order) throw new Error("Réparation introuvable");

    const item = await tx.inventoryItem.findFirst({ where: { id: inventoryItemId } });
    if (!item) throw new Error("Pièce introuvable");
    if (item.quantityInStock < quantity) {
      throw new Error(`Stock insuffisant pour "${item.name}"`);
    }

    await tx.inventoryItem.update({
      where: { id: inventoryItemId },
      data: { quantityInStock: { decrement: quantity } },
    });

    return tx.repairPartUsage.create({
      data: {
        repairOrderId,
        inventoryItemId,
        quantity,
        unitPriceAtUse: item.unitPrice,
      },
    });
  });
}
