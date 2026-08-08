"use client";

import { useTransition } from "react";
import {
  updateQuoteStatusAction,
  convertQuoteToInvoiceAction,
} from "@/lib/actions/quotes";

export function QuoteActions({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {status === "DRAFT" && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => updateQuoteStatusAction(id, "SENT"))}
          className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-60"
        >
          Marquer comme envoyé
        </button>
      )}
      {(status === "DRAFT" || status === "SENT") && (
        <>
          <button
            disabled={pending}
            onClick={() => startTransition(() => updateQuoteStatusAction(id, "ACCEPTED"))}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            Marquer accepté
          </button>
          <button
            disabled={pending}
            onClick={() => startTransition(() => updateQuoteStatusAction(id, "REFUSED"))}
            className="rounded-md border border-input bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-background disabled:opacity-60"
          >
            Marquer refusé
          </button>
        </>
      )}
      {status === "ACCEPTED" && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => convertQuoteToInvoiceAction(id))}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          Convertir en facture
        </button>
      )}
    </div>
  );
}
