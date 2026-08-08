import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { RegisterGarageInput } from "@/lib/validations/auth";

export class EmailAlreadyUsedError extends Error {
  constructor() {
    super("Cet email est déjà utilisé");
  }
}

/**
 * Crée un nouveau garage (tenant) + son propriétaire (OWNER) + ses réglages
 * par défaut + un abonnement Gratuit, en une seule transaction. C'est le
 * seul point d'entrée d'inscription "libre" côté public — employés et
 * clients rejoignent un garage existant uniquement par invitation.
 */
export async function createGarageAndOwner(input: RegisterGarageInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.ownerEmail },
  });
  if (existing) {
    throw new EmailAlreadyUsedError();
  }

  const passwordHash = await bcrypt.hash(input.ownerPassword, 12);

  return prisma.$transaction(async (tx) => {
    const garage = await tx.garage.create({
      data: {
        name: input.garageName,
        phone: input.garagePhone || null,
        email: input.ownerEmail,
        settings: { create: {} },
        subscription: { create: { plan: "FREE", status: "ACTIVE" } },
      },
    });

    const owner = await tx.user.create({
      data: {
        garageId: garage.id,
        email: input.ownerEmail,
        passwordHash,
        firstName: input.ownerFirstName,
        lastName: input.ownerLastName,
        role: "OWNER",
      },
    });

    return { garage, owner };
  });
}
