import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateInviteToken, hashInviteToken, INVITE_TTL_HOURS } from "@/lib/invite-token";
import type { Role } from "@/app/generated/prisma/client";

export async function createStaffInvite(garageId: string, targetEmail: string, role: Role) {
  const existingUser = await prisma.user.findUnique({ where: { email: targetEmail } });
  if (existingUser) {
    throw new Error("Un compte existe déjà avec cet email");
  }

  const { raw, hash } = generateInviteToken();
  await prisma.inviteToken.create({
    data: {
      garageId,
      type: "STAFF",
      tokenHash: hash,
      targetEmail,
      role,
      expiresAt: new Date(Date.now() + INVITE_TTL_HOURS * 3600 * 1000),
    },
  });
  return raw;
}

export async function createClientInvite(garageId: string, clientId: string) {
  const client = await prisma.client.findFirst({ where: { id: clientId, garageId } });
  if (!client) throw new Error("Client introuvable");
  if (!client.email) throw new Error("Le client doit avoir un email pour activer le portail");

  const existingAccount = await prisma.clientPortalAccount.findUnique({ where: { clientId } });
  if (existingAccount) throw new Error("Le portail est déjà activé pour ce client");

  const { raw, hash } = generateInviteToken();
  await prisma.inviteToken.create({
    data: {
      garageId,
      type: "CLIENT",
      tokenHash: hash,
      targetEmail: client.email,
      clientId,
      expiresAt: new Date(Date.now() + INVITE_TTL_HOURS * 3600 * 1000),
    },
  });
  return raw;
}

export async function getInviteByRawToken(rawToken: string) {
  const tokenHash = hashInviteToken(rawToken);
  const invite = await prisma.inviteToken.findUnique({
    where: { tokenHash },
    include: { client: true, garage: true },
  });
  if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
    return null;
  }
  return invite;
}

export async function acceptStaffInvite(
  rawToken: string,
  data: { firstName: string; lastName: string; password: string }
) {
  const invite = await getInviteByRawToken(rawToken);
  if (!invite || invite.type !== "STAFF" || !invite.role) {
    throw new Error("Invitation invalide ou expirée");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        garageId: invite.garageId,
        email: invite.targetEmail,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: invite.role!,
      },
    });
    await tx.inviteToken.update({ where: { id: invite.id }, data: { usedAt: new Date() } });
    return user;
  });
}

export async function acceptClientInvite(rawToken: string, password: string) {
  const invite = await getInviteByRawToken(rawToken);
  if (!invite || invite.type !== "CLIENT" || !invite.clientId) {
    throw new Error("Invitation invalide ou expirée");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return prisma.$transaction(async (tx) => {
    const account = await tx.clientPortalAccount.create({
      data: {
        clientId: invite.clientId!,
        email: invite.targetEmail,
        passwordHash,
      },
    });
    await tx.inviteToken.update({ where: { id: invite.id }, data: { usedAt: new Date() } });
    return account;
  });
}

export async function listStaff(garageId: string) {
  return prisma.user.findMany({ where: { garageId }, orderBy: { createdAt: "asc" } });
}

export async function listPendingStaffInvites(garageId: string) {
  return prisma.inviteToken.findMany({
    where: { garageId, type: "STAFF", usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
}
