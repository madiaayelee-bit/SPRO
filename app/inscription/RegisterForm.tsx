"use client";

import { useActionState } from "react";
import { registerGarageAction, type FormState } from "@/lib/actions/auth";

const initialState: FormState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs text-danger-foreground">{errors[0]}</p>;
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerGarageAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md border border-danger/30 bg-danger px-3 py-2 text-sm text-danger-foreground">
          {state.error}
        </p>
      )}

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Votre garage</legend>
        <div>
          <label htmlFor="garageName" className="block text-sm font-medium text-foreground">
            Nom du garage
          </label>
          <input
            id="garageName"
            name="garageName"
            required
            placeholder="Garage Dubois"
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <FieldError errors={state.fieldErrors?.garageName} />
        </div>
        <div>
          <label htmlFor="garagePhone" className="block text-sm font-medium text-foreground">
            Téléphone (optionnel)
          </label>
          <input
            id="garagePhone"
            name="garagePhone"
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4 border-t border-border pt-4">
        <legend className="text-sm font-semibold text-foreground">
          Votre compte administrateur
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ownerFirstName" className="block text-sm font-medium text-foreground">
              Prénom
            </label>
            <input
              id="ownerFirstName"
              name="ownerFirstName"
              required
              className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <FieldError errors={state.fieldErrors?.ownerFirstName} />
          </div>
          <div>
            <label htmlFor="ownerLastName" className="block text-sm font-medium text-foreground">
              Nom
            </label>
            <input
              id="ownerLastName"
              name="ownerLastName"
              required
              className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <FieldError errors={state.fieldErrors?.ownerLastName} />
          </div>
        </div>
        <div>
          <label htmlFor="ownerEmail" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="ownerEmail"
            name="ownerEmail"
            type="email"
            required
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <FieldError errors={state.fieldErrors?.ownerEmail} />
        </div>
        <div>
          <label htmlFor="ownerPassword" className="block text-sm font-medium text-foreground">
            Mot de passe
          </label>
          <input
            id="ownerPassword"
            name="ownerPassword"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <FieldError errors={state.fieldErrors?.ownerPassword} />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "Création..." : "Créer mon garage"}
      </button>
      <p className="text-center text-xs text-muted-foreground/70">
        Formule Gratuite activée par défaut — vous pourrez passer Pro ou Premium depuis votre
        tableau de bord.
      </p>
    </form>
  );
}
