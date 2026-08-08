import { scopedPrisma } from "@/lib/prisma";
import type { RepairOrderInput } from "@/lib/validations/repair-orders";

export async function listRepairOrders(garageId: string, status?: string) {
  const db = scopedPrisma(garageId);
  return db.repairOrder.findMany({
    where: status ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    include: { vehicle: { include: { client: true } } },
  });
}

export async function getRepairOrder(garageId: string, id: string) {
  const db = scopedPrisma(garageId);
  return db.repairOrder.findFirst({
    where: { id },
    include: {
      vehicle: { include: { client: true } },
      photos: { orderBy: { uploadedAt: "desc" } },
      partsUsed: { include: { inventoryItem: true } },
      assignedUser: true,
      quote: true,
      invoice: true,
    },
  });
}

export async function createRepairOrder(garageId: string, data: RepairOrderInput) {
  const db = scopedPrisma(garageId);
  const vehicle = await db.vehicle.findFirst({ where: { id: data.vehicleId } });
  if (!vehicle) {
    throw new Error("Véhicule introuvable");
  }
  return db.repairOrder.create({
    data: {
      garageId,
      vehicleId: data.vehicleId,
      title: data.title,
      description: data.description || null,
      status: data.status,
      appointmentDate: data.appointmentDate ?? null,
      estimatedDurationMin: data.estimatedDurationMin ?? null,
      warrantyMonths: data.warrantyMonths ?? null,
    },
  });
}

export async function updateRepairOrderStatus(
  garageId: string,
  id: string,
  status: string
) {
  const db = scopedPrisma(garageId);
  return db.repairOrder.update({
    where: { id },
    data: {
      status: status as never,
      completionDate: status === "COMPLETED" ? new Date() : undefined,
    },
  });
}
