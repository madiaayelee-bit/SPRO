"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStaffSession } from "@/lib/session";
import { documentSchema } from "@/lib/validations/quotes";
import { createQuote, updateQuoteStatus, convertQuoteToInvoice } from "@/lib/db/quotes";
import type { FormState } from "@/lib/actions/auth";

export async function createQuoteAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { garageId } = await requireStaffSession();

  let lineItems: unknown = [];
  try {
    lineItems = JSON.parse(String(formData.get("lineItemsJson") || "[]"));
  } catch {
    return { error: "Lignes de devis invalides" };
  }

  const parsed = documentSchema.safeParse({
    clientId: formData.get("clientId"),
    repairOrderId: formData.get("repairOrderId") || undefined,
    laborHours: formData.get("laborHours") || 0,
    lineItems,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let quote;
  try {
    quote = await createQuote(garageId, parsed.data);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Erreur inconnue" };
  }

  redirect(`/dashboard/devis/${quote.id}`);
}

export async function updateQuoteStatusAction(id: string, status: string) {
  const { garageId } = await requireStaffSession();
  await updateQuoteStatus(garageId, id, status);
  revalidatePath(`/dashboard/devis/${id}`);
  revalidatePath("/dashboard/devis");
}

export async function convertQuoteToInvoiceAction(quoteId: string) {
  const { garageId } = await requireStaffSession();
  const invoice = await convertQuoteToInvoice(garageId, quoteId);
  revalidatePath(`/dashboard/devis/${quoteId}`);
  revalidatePath("/dashboard/factures");
  redirect(`/dashboard/factures/${invoice.id}`);
}
