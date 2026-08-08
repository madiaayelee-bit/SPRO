"use client";

import { useActionState } from "react";
import { acceptStaffInviteAction, type AcceptInviteState } from "@/lib/actions/invites";
import { inputClass, labelClass } from "@/app/components/FormField";

export function StaffAcceptForm({ token, email }: { token: string; email: string }) {
  const action = acceptStaffInviteAction.bind(null, token);
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            Prénom
          </label>
          <input id="firstName" name="firstName" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>
            Nom
          </label>
          <input id="lastName" name="lastName" required className={inputClass} />
        </div>
      </div>
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
        {pending ? "Activation..." : "Activer mon compte"}
      </button>
    </form>
  );
}
