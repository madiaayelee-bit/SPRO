"use server";

import { redirect } from "next/navigation";
import { requireStaffSession } from "@/lib/session";
import { vehicleSchema } from "@/lib/validations/vehicles";
import { createVehicle, updateVehicle } from "@/lib/db/vehicles";
import type { FormState } from "@/lib/actions/auth";

export async function createVehicleAction(
  clientId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { garageId } = await requireStaffSession();

  const parsed = vehicleSchema.safeParse({
    type: formData.get("type"),
    make: formData.get("make"),
    model: formData.get("model"),
    plateNumber: formData.get("plateNumber"),
    vin: formData.get("vin"),
    year: formData.get("year"),
    mileage: formData.get("mileage"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await createVehicle(garageId, clientId, parsed.data);
  redirect(`/dashboard/clients/${clientId}`);
}

export async function updateVehicleAction(
  id: string,
  clientId: string,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { garageId } = await requireStaffSession();

  const parsed = vehicleSchema.safeParse({
    type: formData.get("type"),
    make: formData.get("make"),
    model: formData.get("model"),
    plateNumber: formData.get("plateNumber"),
    vin: formData.get("vin"),
    year: formData.get("year"),
    mileage: formData.get("mileage"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await updateVehicle(garageId, id, parsed.data);
  redirect(`/dashboard/clients/${clientId}`);
}
