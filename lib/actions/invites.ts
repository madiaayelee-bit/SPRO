"use server";

import { revalidatePath } from "next/cache";
import { requireStaffSession } from "@/lib/session";
import { signIn } from "@/lib/auth";
import {
  createStaffInvite,
  createClientInvite,
  acceptStaffInvite,
  acceptClientInvite,
  listStaff,
  listPendingStaffInvites,
} from "@/lib/db/invites";
import { assertWithinLimit, assertFeatureEnabled, PlanLimitExceededError } from "@/lib/plan-guard";
import type { Role } from "@/app/generated/prisma/client";

export type InviteState = { error?: string; inviteUrl?: string };

function inviteUrl(rawToken: string) {
  const base = process.env.APP_URL || "http://localhost:3000";
  return `${base}/inviter/${rawToken}`;
}

export async function createStaffInviteAction(
  _prevState: InviteState,
  formData: FormData
): Promise<InviteState> {
  const { garageId, role } = await requireStaffSession();
  if (role !== "OWNER") {
    return { error: "Seul le propriétaire peut inviter des employés." };
  }

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const inviteRole = String(formData.get("role") || "MECHANIC") as Role;

  if (!email) return { error: "Email requis" };

  try {
    const [staff, pendingInvites] = await Promise.all([
      listStaff(garageId),
      listPendingStaffInvites(garageId),
    ]);
    await assertWithinLimit(garageId, "maxStaffUsers", staff.length + pendingInvites.length);
  } catch (err) {
    if (err instanceof PlanLimitExceededError) return { error: err.message };
    throw err;
  }

  try {
    const raw = await createStaffInvite(garageId, email, inviteRole);
    revalidatePath("/dashboard/parametres/equipe");
    return { inviteUrl: inviteUrl(raw) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}

export async function createClientPortalInviteAction(
  clientId: string,
  _prevState: InviteState,
  _formData: FormData
): Promise<InviteState> {
  const { garageId } = await requireStaffSession();

  try {
    await assertFeatureEnabled(garageId, "clientPortal");
  } catch (err) {
    if (err instanceof PlanLimitExceededError) return { error: err.message };
    throw err;
  }

  try {
    const raw = await createClientInvite(garageId, clientId);
    revalidatePath(`/dashboard/clients/${clientId}`);
    return { inviteUrl: inviteUrl(raw) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}

export type AcceptInviteState = { error?: string };

export async function acceptStaffInviteAction(
  token: string,
  _prevState: AcceptInviteState,
  formData: FormData
): Promise<AcceptInviteState> {
  const firstName = String(formData.get("firstName") || "").trim();
  const lastName = String(formData.get("lastName") || "").trim();
  const password = String(formData.get("password") || "");

  if (!firstName || !lastName) return { error: "Prénom et nom requis" };
  if (password.length < 8) return { error: "Mot de passe : 8 caractères minimum" };

  let user;
  try {
    user = await acceptStaffInvite(token, { firstName, lastName, password });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }

  await signIn("credentials", { email: user.email, password, redirectTo: "/dashboard" });
  return {};
}

export async function acceptClientInviteAction(
  token: string,
  _prevState: AcceptInviteState,
  formData: FormData
): Promise<AcceptInviteState> {
  const password = String(formData.get("password") || "");
  if (password.length < 8) return { error: "Mot de passe : 8 caractères minimum" };

  let account;
  try {
    account = await acceptClientInvite(token, password);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }

  await signIn("credentials", { email: account.email, password, redirectTo: "/portail" });
  return {};
}
