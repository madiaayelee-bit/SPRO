import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { listStaff, listPendingStaffInvites } from "@/lib/db/invites";
import { InviteStaffForm } from "./InviteStaffForm";

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Propriétaire",
  MANAGER: "Manager",
  MECHANIC: "Mécanicien",
};

export default async function EquipePage() {
  const { garageId, role } = await requireStaffSession();
  const [staff, pendingInvites] = await Promise.all([
    listStaff(garageId),
    listPendingStaffInvites(garageId),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/parametres"
          className="text-sm text-muted-foreground/70 hover:text-muted-foreground"
        >
          ← Paramètres
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Équipe</h1>
      </div>

      {role === "OWNER" ? (
        <InviteStaffForm />
      ) : (
        <p className="text-sm text-muted-foreground">
          Seul le propriétaire du garage peut inviter de nouveaux membres.
        </p>
      )}

      <div>
        <h2 className="text-lg font-bold text-foreground">Membres</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Nom</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Rôle</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-2 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-2 text-muted-foreground">{ROLE_LABELS[user.role]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pendingInvites.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground">Invitations en attente</h2>
          <div className="mt-3 space-y-2">
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="rounded-lg border border-border bg-card p-3 text-sm"
              >
                {invite.targetEmail} — {ROLE_LABELS[invite.role ?? "MECHANIC"]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
