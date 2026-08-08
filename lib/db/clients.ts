import { scopedPrisma } from "@/lib/prisma";
import type { ClientInput } from "@/lib/validations/clients";

export async function listClients(garageId: string, search?: string) {
  const db = scopedPrisma(garageId);
  return db.client.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { lastName: "asc" },
    include: { vehicles: true },
  });
}

export async function countClients(garageId: string) {
  const db = scopedPrisma(garageId);
  return db.client.count();
}

export async function getClient(garageId: string, id: string) {
  const db = scopedPrisma(garageId);
  return db.client.findFirst({
    where: { id },
    include: {
      vehicles: { orderBy: { createdAt: "desc" } },
      portalAccount: true,
    },
  });
}

export async function createClient(garageId: string, data: ClientInput) {
  const db = scopedPrisma(garageId);
  return db.client.create({
    data: {
      garageId,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
    },
  });
}

export async function updateClient(garageId: string, id: string, data: ClientInput) {
  const db = scopedPrisma(garageId);
  return db.client.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address || null,
      phone: data.phone || null,
      email: data.email || null,
    },
  });
}

export async function deleteClient(garageId: string, id: string) {
  const db = scopedPrisma(garageId);
  return db.client.delete({ where: { id } });
}
