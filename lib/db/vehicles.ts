import { scopedPrisma } from "@/lib/prisma";
import type { VehicleInput } from "@/lib/validations/vehicles";

export async function listVehicles(garageId: string) {
  const db = scopedPrisma(garageId);
  return db.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true },
  });
}

export async function getVehicle(garageId: string, id: string) {
  const db = scopedPrisma(garageId);
  return db.vehicle.findFirst({
    where: { id },
    include: { client: true, repairOrders: { orderBy: { createdAt: "desc" } } },
  });
}

export async function createVehicle(garageId: string, clientId: string, data: VehicleInput) {
  const db = scopedPrisma(garageId);
  // Vérifie que le client appartient bien à ce garage avant de lier le véhicule.
  const client = await db.client.findFirst({ where: { id: clientId } });
  if (!client) {
    throw new Error("Client introuvable");
  }
  return db.vehicle.create({
    data: {
      garageId,
      clientId,
      type: data.type,
      make: data.make,
      model: data.model,
      plateNumber: data.plateNumber,
      vin: data.vin || null,
      year: data.year ?? null,
      mileage: data.mileage ?? null,
    },
  });
}

export async function updateVehicle(garageId: string, id: string, data: VehicleInput) {
  const db = scopedPrisma(garageId);
  return db.vehicle.update({
    where: { id },
    data: {
      type: data.type,
      make: data.make,
      model: data.model,
      plateNumber: data.plateNumber,
      vin: data.vin || null,
      year: data.year ?? null,
      mileage: data.mileage ?? null,
    },
  });
}
