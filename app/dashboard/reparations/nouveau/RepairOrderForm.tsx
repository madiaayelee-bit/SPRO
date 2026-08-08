"use client";

import { useActionState } from "react";
import { FieldError, inputClass, labelClass } from "@/app/components/FormField";
import { createRepairOrderAction } from "@/lib/actions/repair-orders";
import type { FormState } from "@/lib/actions/auth";

type VehicleOption = {
  id: string;
  make: string;
  model: string;
  plateNumber: string;
  client: { firstName: string; lastName: string };
};

export function RepairOrderForm({ vehicles }: { vehicles: VehicleOption[] }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    createRepairOrderAction,
    {}
  );

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {state.error && (
        <p className="rounded-md border border-danger/30 bg-danger px-3 py-2 text-sm text-danger-foreground">{state.error}</p>
      )}
      <div>
        <label htmlFor="vehicleId" className={labelClass}>
          Véhicule
        </label>
        <select id="vehicleId" name="vehicleId" required className={inputClass}>
          <option value="">Sélectionner un véhicule</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.client.firstName} {v.client.lastName} — {v.make} {v.model} ({v.plateNumber})
            </option>
          ))}
        </select>
        <FieldError errors={state.fieldErrors?.vehicleId} />
      </div>
      <div>
        <label htmlFor="title" className={labelClass}>
          Panne / intervention
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="Ex : Changement plaquettes de frein"
          className={inputClass}
        />
        <FieldError errors={state.fieldErrors?.title} />
      </div>
      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea id="description" name="description" rows={3} className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="appointmentDate" className={labelClass}>
            Rendez-vous
          </label>
          <input
            id="appointmentDate"
            name="appointmentDate"
            type="datetime-local"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="estimatedDurationMin" className={labelClass}>
            Durée estimée (min)
          </label>
          <input
            id="estimatedDurationMin"
            name="estimatedDurationMin"
            type="number"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="warrantyMonths" className={labelClass}>
          Garantie (mois)
        </label>
        <input
          id="warrantyMonths"
          name="warrantyMonths"
          type="number"
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "Création..." : "Créer la réparation"}
      </button>
    </form>
  );
}
