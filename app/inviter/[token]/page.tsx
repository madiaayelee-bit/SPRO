import Link from "next/link";
import { getInviteByRawToken } from "@/lib/db/invites";
import { StaffAcceptForm } from "./StaffAcceptForm";
import { ClientAcceptForm } from "./ClientAcceptForm";

export default async function InviterPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInviteByRawToken(token);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        <Link href="/" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
          ← Accueil
        </Link>

        {!invite ? (
          <>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              Invitation invalide ou expirée
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Demandez un nouveau lien d&apos;invitation à votre garage.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-2xl font-bold text-foreground">
              Rejoindre {invite.garage.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {invite.type === "STAFF"
                ? "Activez votre compte employé."
                : "Activez votre accès au portail client."}
            </p>
            <div className="mt-6">
              {invite.type === "STAFF" ? (
                <StaffAcceptForm token={token} email={invite.targetEmail} />
              ) : (
                <ClientAcceptForm token={token} email={invite.targetEmail} />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
