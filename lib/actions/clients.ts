"use server";

import { redirect } from "next/navigation";
import { requireStaffSession } from "@/lib/session";
import { clientSchema } from "@/lib/validations/clients";
import { createClient, updateClient, deleteClient, countClients } from "@/lib/db/clients";
import { assertWithinLimit, PlanLimitExceededError } from "@/lib/plan-guard";
import type { FormState } from "@/lib/actions/auth";

export async function createClientAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { garageId } = await requireStaffSession();

  const parsed = clientSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await assertWithinLimit(garageId, "maxClients", await countClients(garageId));
  } catch (err) {
    if (err instanceof PlanLimitExceededError) return { error: err.message };
    throw err;
  }

  const client = await createClient(garageId, parsed.data);
  redirect(`/dashboard/clients/${client.id}`);
}

export async function updateClientAction(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { garageId } = await requireStaffSession();

  const parsed = clientSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await updateClient(garageId, id, parsed.data);
  redirect(`/dashboard/clients/${id}`);
}

export async function deleteClientAction(id: string) {
  const { garageId } = await requireStaffSession();
  await deleteClient(garageId, id);
  redirect("/dashboard/clients");
}
