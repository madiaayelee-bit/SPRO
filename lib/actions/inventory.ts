"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStaffSession } from "@/lib/session";
import { inventoryItemSchema } from "@/lib/validations/inventory";
import { createInventoryItem, updateInventoryItem, recordPartUsage } from "@/lib/db/inventory";
import type { FormState } from "@/lib/actions/auth";

export async function createInventoryItemAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { garageId } = await requireStaffSession();

  const parsed = inventoryItemSchema.safeParse({
    name: formData.get("name"),
    reference: formData.get("reference"),
    unitPrice: formData.get("unitPrice"),
    quantityInStock: formData.get("quantityInStock"),
    lowStockThreshold: formData.get("lowStockThreshold") || 3,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await createInventoryItem(garageId, parsed.data);
  redirect("/dashboard/stock");
}

export async function updateInventoryItemAction(
  id: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { garageId } = await requireStaffSession();

  const parsed = inventoryItemSchema.safeParse({
    name: formData.get("name"),
    reference: formData.get("reference"),
    unitPrice: formData.get("unitPrice"),
    quantityInStock: formData.get("quantityInStock"),
    lowStockThreshold: formData.get("lowStockThreshold") || 3,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await updateInventoryItem(garageId, id, parsed.data);
  redirect("/dashboard/stock");
}

export async function usePartAction(
  repairOrderId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { garageId } = await requireStaffSession();

  const inventoryItemId = String(formData.get("inventoryItemId") || "");
  const quantity = Number(formData.get("quantity") || 1);

  if (!inventoryItemId || quantity < 1) {
    return { error: "Sélectionnez une pièce et une quantité valide." };
  }

  try {
    await recordPartUsage(garageId, repairOrderId, inventoryItemId, quantity);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }

  revalidatePath(`/dashboard/reparations/${repairOrderId}`);
  return {};
}
