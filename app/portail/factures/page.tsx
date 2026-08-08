import { requireClientSession } from "@/lib/session";
import { listMyInvoices } from "@/lib/db/portal";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyée",
  PAID: "Payée",
  OVERDUE: "En retard",
  CANCELLED: "Annulée",
};

export default async function PortalInvoicesPage() {
  const { garageId, clientId } = await requireClientSession();
  const invoices = await listMyInvoices(garageId, clientId);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-foreground">Mes factures</h1>
      {invoices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
          Aucune facture pour l&apos;instant.
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
            >
              <div>
                <p className="font-semibold text-foreground">{inv.number}</p>
                <p className="text-sm text-muted-foreground">{STATUS_LABELS[inv.status]}</p>
              </div>
              <p className="font-semibold text-foreground">{Number(inv.total).toFixed(2)} €</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
