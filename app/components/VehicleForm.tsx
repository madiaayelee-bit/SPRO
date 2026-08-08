"use client";

import { useActionState } from "react";
import { FieldError, inputClass, labelClass } from "./FormField";
import type { FormState } from "@/lib/actions/auth";

type Action = (prevState: FormState, formData: FormData) => Promise<FormState>;

export function VehicleForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: Action;
  defaultValues?: {
    type: string;
    make: string;
    model: string;
    plateNumber: string;
    vin: string | null;
    year: number | null;
    mileage: number | null;
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
        <label htmlFor="type" className={labelClass}>
          Type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={defaultValues?.type ?? "CAR"}
          className={inputClass}
        >
          <option value="CAR">Voiture</option>
          <option value="MOTORCYCLE">Moto</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="make" className={labelClass}>
            Marque
          </label>
          <input
            id="make"
            name="make"
            required
            defaultValue={defaultValues?.make}
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors?.make} />
        </div>
        <div>
          <label htmlFor="model" className={labelClass}>
            Modèle
          </label>
          <input
            id="model"
            name="model"
            required
            defaultValue={defaultValues?.model}
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors?.model} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="plateNumber" className={labelClass}>
            Plaque d&apos;immatriculation
          </label>
          <input
            id="plateNumber"
            name="plateNumber"
            required
            defaultValue={defaultValues?.plateNumber}
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors?.plateNumber} />
        </div>
        <div>
          <label htmlFor="vin" className={labelClass}>
            Numéro de châssis (VIN)
          </label>
          <input
            id="vin"
            name="vin"
            defaultValue={defaultValues?.vin ?? ""}
            className={inputClass}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="year" className={labelClass}>
            Année
          </label>
          <input
            id="year"
            name="year"
            type="number"
            defaultValue={defaultValues?.year ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="mileage" className={labelClass}>
            Kilométrage
          </label>
          <input
            id="mileage"
            name="mileage"
            type="number"
            defaultValue={defaultValues?.mileage ?? ""}
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
