import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { listQuotes } from "@/lib/db/quotes";
import { QUOTE_STATUS_TONES, statusBadgeClass } from "@/lib/status-colors";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyé",
  ACCEPTED: "Accepté",
  REFUSED: "Refusé",
  CANCELLED: "Annulé",
};

export default async function DevisPage() {
  const { garageId } = await requireStaffSession();
  const quotes = await listQuotes(garageId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Devis</h1>
        <Link
          href="/dashboard/devis/nouveau"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          + Nouveau devis
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun devis pour l&apos;instant.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Numéro</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => (
                <tr
                  key={q.id}
                  className="border-b border-border last:border-0 hover:bg-muted"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/devis/${q.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {q.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {q.client.firstName} {q.client.lastName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{Number(q.total).toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span className={statusBadgeClass(QUOTE_STATUS_TONES[q.status])}>
                      {STATUS_LABELS[q.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
