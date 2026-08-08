"use client";

import { useTransition } from "react";
import { respondToQuoteAction } from "@/lib/actions/portal";

export function QuoteResponseButtons({ quoteId }: { quoteId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        disabled={pending}
        onClick={() => startTransition(() => respondToQuoteAction(quoteId, "ACCEPTED"))}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        Accepter le devis
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => respondToQuoteAction(quoteId, "REFUSED"))}
        className="rounded-md border border-input bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-background disabled:opacity-60"
      >
        Refuser
      </button>
    </div>
  );
}
