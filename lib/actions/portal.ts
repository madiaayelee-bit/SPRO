"use server";

import { revalidatePath } from "next/cache";
import { requireClientSession } from "@/lib/session";
import { respondToQuote } from "@/lib/db/portal";

export async function respondToQuoteAction(quoteId: string, status: "ACCEPTED" | "REFUSED") {
  const { garageId, clientId } = await requireClientSession();
  await respondToQuote(garageId, clientId, quoteId, status);
  revalidatePath(`/portail/devis/${quoteId}`);
}
