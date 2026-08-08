"use client";

import { useActionState } from "react";
import { FieldError, inputClass, labelClass } from "./FormField";
import type { FormState } from "@/lib/actions/auth";

type Action = (prevState: FormState, formData: FormData) => Promise<FormState>;

export function ClientForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: Action;
  defaultValues?: {
    firstName: string;
    lastName: string;
    address: string | null;
    phone: string | null;
    email: string | null;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {state.error && (
        <p className="rounded-md border border-danger/30 bg-danger px-3 py-2 text-sm text-danger-foreground">{state.error}</p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            Prénom
          </label>
          <input
            id="firstName"
            name="firstName"
            required
            defaultValue={defaultValues?.firstName}
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors?.firstName} />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Nom
          </label>
          <input
            id="lastName"
            name="lastName"
            required
            defaultValue={defaultValues?.lastName}
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors?.lastName} />
        </div>
      </div>
      <div>
        <label htmlFor="address" className={labelClass}>
          Adresse
        </label>
        <input
          id="address"
          name="address"
          defaultValue={defaultValues?.address ?? ""}
          className={inputClass}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Téléphone
          </label>
          <input
            id="phone"
            name="phone"
            defaultValue={defaultValues?.phone ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email ?? ""}
            className={inputClass}
          />
          <FieldError errors={state.fieldErrors?.email} />
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
