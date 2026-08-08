import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { listInvoices } from "@/lib/db/invoices";
import { INVOICE_STATUS_TONES, statusBadgeClass } from "@/lib/status-colors";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyée",
  PAID: "Payée",
  OVERDUE: "En retard",
  CANCELLED: "Annulée",
};

export default async function FacturesPage() {
  const { garageId } = await requireStaffSession();
  const invoices = await listInvoices(garageId);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Factures</h1>

      {invoices.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucune facture pour l&apos;instant. Les factures sont créées à partir d&apos;un devis
          accepté.
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
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b border-border last:border-0 hover:bg-muted"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/factures/${inv.id}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {inv.number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {inv.client.firstName} {inv.client.lastName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{Number(inv.total).toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span className={statusBadgeClass(INVOICE_STATUS_TONES[inv.status])}>
                      {STATUS_LABELS[inv.status]}
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
