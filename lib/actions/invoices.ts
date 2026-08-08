"use server";

import { revalidatePath } from "next/cache";
import { requireStaffSession } from "@/lib/session";
import { markInvoicePaid } from "@/lib/db/invoices";

export async function markInvoicePaidAction(id: string) {
  const { garageId } = await requireStaffSession();
  await markInvoicePaid(garageId, id);
  revalidatePath(`/dashboard/factures/${id}`);
  revalidatePath("/dashboard/factures");
}
