"use client";

import { useActionState } from "react";
import { createStaffInviteAction, type InviteState } from "@/lib/actions/invites";
import { inputClass, labelClass } from "@/app/components/FormField";

export function InviteStaffForm() {
  const [state, formAction, pending] = useActionState<InviteState, FormData>(
    createStaffInviteAction,
    {}
  );

  return (
    <div className="max-w-md space-y-3">
      <form action={formAction} className="flex flex-wrap items-end gap-2">
        <div className="flex-1">
          <label htmlFor="email" className={labelClass}>
            Email de l&apos;employé
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>
            Rôle
          </label>
          <select id="role" name="role" defaultValue="MECHANIC" className={inputClass}>
            <option value="MECHANIC">Mécanicien</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? "..." : "Inviter"}
        </button>
      </form>
      {state.error && <p className="text-sm text-danger-foreground">{state.error}</p>}
      {state.inviteUrl && (
        <div className="rounded-md border border-success/30 bg-success p-3 text-sm text-success-foreground">
          <p className="font-medium">Invitation créée — partagez ce lien avec l&apos;employé :</p>
          <p className="mt-1 break-all font-mono text-xs">{state.inviteUrl}</p>
        </div>
      )}
    </div>
  );
}
