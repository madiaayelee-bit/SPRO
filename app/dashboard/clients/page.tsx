import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { listClients } from "@/lib/db/clients";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { garageId } = await requireStaffSession();
  const { q } = await searchParams;
  const clients = await listClients(garageId, q);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Clients</h1>
        <Link
          href="/dashboard/clients/nouveau"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          + Nouveau client
        </Link>
      </div>

      <form className="max-w-sm">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher un client..."
          className="w-full rounded-md border border-input px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </form>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun client pour l&apos;instant.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nom</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Véhicules</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-border last:border-0 hover:bg-background"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {client.firstName} {client.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{client.phone || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{client.email || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{client.vehicles.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
