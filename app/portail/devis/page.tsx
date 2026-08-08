import Link from "next/link";
import { requireClientSession } from "@/lib/session";
import { listMyQuotes } from "@/lib/db/portal";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "En attente de votre réponse",
  ACCEPTED: "Accepté",
  REFUSED: "Refusé",
  CANCELLED: "Annulé",
};

export default async function PortalQuotesPage() {
  const { garageId, clientId } = await requireClientSession();
  const quotes = await listMyQuotes(garageId, clientId);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">Mes devis</h1>
      {quotes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun devis pour l&apos;instant.
        </div>
      ) : (
        <div className="space-y-2">
          {quotes.map((q) => (
            <Link
              key={q.id}
              href={`/portail/devis/${q.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:border-primary/40"
            >
              <div>
                <p className="font-semibold text-foreground">{q.number}</p>
                <p className="text-sm text-muted-foreground">{STATUS_LABELS[q.status]}</p>
              </div>
              <p className="font-semibold text-foreground">{Number(q.total).toFixed(2)} €</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
