"use client";

import { useActionState } from "react";
import { FieldError, inputClass, labelClass } from "./FormField";
import type { FormState } from "@/lib/actions/auth";

type Action = (prevState: FormState, formData: FormData) => Promise<FormState>;

export function InventoryItemForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: Action;
  defaultValues?: {
    name: string;
    reference: string | null;
    unitPrice: unknown;
    quantityInStock: number;
    lowStockThreshold: number;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {state.error && (
        <p className="rounded-md border border-danger/30 bg-danger px-3 py-2 text-sm text-danger-foreground">{state.error}</p>
      )}
      <div>
        <label htmlFor="name" className={labelClass}>
          Nom de la pièce
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaultValues?.name}
          className={inputClass}
        />
        <FieldError errors={state.fieldErrors?.name} />
      </div>
      <div>
        <label htmlFor="reference" className={labelClass}>
          Référence (optionnel)
        </label>
        <input
          id="reference"
          name="reference"
          defaultValue={defaultValues?.reference ?? ""}
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label htmlFor="unitPrice" className={labelClass}>
            Prix unitaire (€)
          </label>
          <input
            id="unitPrice"
            name="unitPrice"
            type="number"
            step="0.01"
            required
            defaultValue={
              defaultValues?.unitPrice != null ? String(defaultValues.unitPrice) : undefined
            }
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors?.unitPrice} />
        </div>
        <div>
          <label htmlFor="quantityInStock" className={labelClass}>
            Quantité
          </label>
          <input
            id="quantityInStock"
            name="quantityInStock"
            type="number"
            required
            defaultValue={defaultValues?.quantityInStock}
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors?.quantityInStock} />
        </div>
        <div>
          <label htmlFor="lowStockThreshold" className={labelClass}>
            Seuil d&apos;alerte
          </label>
          <input
            id="lowStockThreshold"
            name="lowStockThreshold"
            type="number"
            defaultValue={defaultValues?.lowStockThreshold ?? 3}
            className={inputClass}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "Enregistrement..." : submitLabel}
      </button>
    </form>
  );
}
