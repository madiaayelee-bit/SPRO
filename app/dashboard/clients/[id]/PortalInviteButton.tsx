"use client";

import { useActionState } from "react";
import { createClientPortalInviteAction, type InviteState } from "@/lib/actions/invites";

export function PortalInviteButton({ clientId }: { clientId: string }) {
  const action = createClientPortalInviteAction.bind(null, clientId);
  const [state, formAction, pending] = useActionState<InviteState, FormData>(action, {});

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-60"
        >
          {pending ? "..." : "Donner accès au portail"}
        </button>
      </form>
      {state.error && <p className="text-sm text-danger-foreground">{state.error}</p>}
      {state.inviteUrl && (
        <div className="rounded-md border border-success/30 bg-success p-3 text-sm text-success-foreground">
          <p className="font-medium">Partagez ce lien avec le client :</p>
          <p className="mt-1 break-all font-mono text-xs">{state.inviteUrl}</p>
        </div>
      )}
    </div>
  );
}
