"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStaffSession } from "@/lib/session";
import { repairOrderSchema } from "@/lib/validations/repair-orders";
import { createRepairOrder, updateRepairOrderStatus } from "@/lib/db/repair-orders";
import type { FormState } from "@/lib/actions/auth";

export async function createRepairOrderAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { garageId } = await requireStaffSession();

  const parsed = repairOrderSchema.safeParse({
    vehicleId: formData.get("vehicleId"),
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status") || "RECEIVED",
    appointmentDate: formData.get("appointmentDate"),
    estimatedDurationMin: formData.get("estimatedDurationMin"),
    warrantyMonths: formData.get("warrantyMonths"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const order = await createRepairOrder(garageId, parsed.data);
  redirect(`/dashboard/reparations/${order.id}`);
}

export async function updateRepairStatusAction(id: string, status: string) {
  const { garageId } = await requireStaffSession();
  await updateRepairOrderStatus(garageId, id, status);
  revalidatePath(`/dashboard/reparations/${id}`);
  revalidatePath("/dashboard/reparations");
}
