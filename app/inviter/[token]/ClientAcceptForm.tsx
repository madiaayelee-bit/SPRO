"use client";

import { useActionState } from "react";
import { acceptClientInviteAction, type AcceptInviteState } from "@/lib/actions/invites";
import { inputClass, labelClass } from "@/app/components/FormField";

export function ClientAcceptForm({ token, email }: { token: string; email: string }) {
  const action = acceptClientInviteAction.bind(null, token);
  const [state, formAction, pending] = useActionState<AcceptInviteState, FormData>(
    action,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="rounded-md border border-danger/30 bg-danger px-3 py-2 text-sm text-danger-foreground">{state.error}</p>
      )}
      <p className="text-sm text-muted-foreground">Compte pour : {email}</p>
      <div>
        <label htmlFor="password" className={labelClass}>
          Choisir un mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "Activation..." : "Activer mon accès"}
      </button>
    </form>
  );
}
