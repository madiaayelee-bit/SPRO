"use client";

import { useActionState } from "react";
import { usePartAction } from "@/lib/actions/inventory";
import { inputClass } from "@/app/components/FormField";
import type { FormState } from "@/lib/actions/auth";

type InventoryOption = { id: string; name: string; quantityInStock: number };

export function PartsUsedForm({
  repairOrderId,
  inventory,
}: {
  repairOrderId: string;
  inventory: InventoryOption[];
}) {
  const action = usePartAction.bind(null, repairOrderId);
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  if (inventory.length === 0) {
    return (
      <p className="text-sm text-muted-foreground/70">
        Aucune pièce en stock — ajoutez-en depuis la page Stock.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      {state.error && <p className="w-full text-sm text-danger-foreground">{state.error}</p>}
      <div>
        <select name="inventoryItemId" required className={inputClass}>
          <option value="">Sélectionner une pièce</option>
          {inventory.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} ({item.quantityInStock} en stock)
            </option>
          ))}
        </select>
      </div>
      <div>
        <input
          type="number"
          name="quantity"
          min={1}
          defaultValue={1}
          className={`${inputClass} w-20`}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-60"
      >
        {pending ? "..." : "Utiliser"}
      </button>
    </form>
  );
}
