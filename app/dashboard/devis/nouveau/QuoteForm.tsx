"use client";

import { useActionState, useState } from "react";
import { FieldError, inputClass, labelClass } from "@/app/components/FormField";
import { createQuoteAction } from "@/lib/actions/quotes";
import type { FormState } from "@/lib/actions/auth";

type ClientOption = { id: string; firstName: string; lastName: string };
type LineItem = { description: string; quantity: number; unitPrice: number };

export function QuoteForm({
  clients,
  hourlyRate,
  defaultClientId,
  defaultRepairOrderId,
}: {
  clients: ClientOption[];
  hourlyRate: number;
  defaultClientId?: string;
  defaultRepairOrderId?: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    createQuoteAction,
    {}
  );
  const [laborHours, setLaborHours] = useState(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const partsTotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);
  const laborTotal = laborHours * hourlyRate;

  function updateLine(index: number, patch: Partial<LineItem>) {
    setLineItems((prev) => prev.map((li, i) => (i === index ? { ...li, ...patch } : li)));
  }

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {state.error && (
        <p className="rounded-md border border-danger/30 bg-danger px-3 py-2 text-sm text-danger-foreground">{state.error}</p>
      )}

      <div>
        <label htmlFor="clientId" className={labelClass}>
          Client
        </label>
        <select
          id="clientId"
          name="clientId"
          required
          defaultValue={defaultClientId ?? ""}
          className={inputClass}
        >
          <option value="">Sélectionner un client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName} {c.lastName}
            </option>
          ))}
        </select>
        <FieldError errors={state.fieldErrors?.clientId} />
      </div>

      <div>
        <label htmlFor="laborHours" className={labelClass}>
          Heures de main d&apos;œuvre
        </label>
        <input
          id="laborHours"
          name="laborHours"
          type="number"
          step="0.25"
          min="0"
          value={laborHours}
          onChange={(e) => setLaborHours(Number(e.target.value) || 0)}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-muted-foreground/70">
          Le taux horaire configuré dans les paramètres du garage sera appliqué.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Pièces / prestations</label>
          <button
            type="button"
            onClick={() =>
              setLineItems((prev) => [...prev, { description: "", quantity: 1, unitPrice: 0 }])
            }
            className="text-sm font-medium text-primary hover:underline"
          >
            + Ajouter une ligne
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {lineItems.map((li, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                placeholder="Description"
                value={li.description}
                onChange={(e) => updateLine(i, { description: e.target.value })}
                className={`${inputClass} col-span-6`}
              />
              <input
                type="number"
                min={1}
                placeholder="Qté"
                value={li.quantity}
                onChange={(e) => updateLine(i, { quantity: Number(e.target.value) || 1 })}
                className={`${inputClass} col-span-2`}
              />
              <input
                type="number"
                step="0.01"
                min={0}
                placeholder="Prix unitaire"
                value={li.unitPrice}
                onChange={(e) => updateLine(i, { unitPrice: Number(e.target.value) || 0 })}
                className={`${inputClass} col-span-3`}
              />
              <button
                type="button"
                onClick={() => setLineItems((prev) => prev.filter((_, idx) => idx !== i))}
                className="col-span-1 text-muted-foreground/70 hover:text-danger-foreground"
                aria-label="Supprimer la ligne"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <input type="hidden" name="lineItemsJson" value={JSON.stringify(lineItems)} readOnly />
      {defaultRepairOrderId && (
        <input type="hidden" name="repairOrderId" value={defaultRepairOrderId} />
      )}

      <div className="rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
        Estimation indicative — main d&apos;œuvre {laborTotal.toFixed(2)} € ({hourlyRate} €/h) +
        pièces {partsTotal.toFixed(2)} €. Le total exact (avec TVA) est calculé par le serveur à
        l&apos;enregistrement.
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "Création..." : "Créer le devis"}
      </button>
    </form>
  );
}
