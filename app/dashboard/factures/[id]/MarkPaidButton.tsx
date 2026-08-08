"use client";

import { useTransition } from "react";
import { markInvoicePaidAction } from "@/lib/actions/invoices";

export function MarkPaidButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => markInvoicePaidAction(id))}
      className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
    >
      Marquer comme payée
    </button>
  );
}
