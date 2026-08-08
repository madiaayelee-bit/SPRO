import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffSession } from "@/lib/session";
import { getInvoice } from "@/lib/db/invoices";
import { MarkPaidButton } from "./MarkPaidButton";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyée",
  PAID: "Payée",
  OVERDUE: "En retard",
  CANCELLED: "Annulée",
};

export default async function FactureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { garageId } = await requireStaffSession();
  const { id } = await params;
  const invoice = await getInvoice(garageId, id);

  if (!invoice) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/factures"
            className="text-sm text-muted-foreground/70 hover:text-muted-foreground"
          >
            ← Factures
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{invoice.number}</h1>
          <Link
            href={`/dashboard/clients/${invoice.clientId}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {invoice.client.firstName} {invoice.client.lastName}
          </Link>
          <p className="text-sm text-muted-foreground/70">{STATUS_LABELS[invoice.status]}</p>
        </div>
        {invoice.status !== "PAID" && <MarkPaidButton id={invoice.id} />}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Description</th>
              <th className="px-4 py-2 font-medium">Qté</th>
              <th className="px-4 py-2 font-medium">Prix unit.</th>
              <th className="px-4 py-2 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((li) => (
              <tr key={li.id} className="border-b border-border last:border-0">
                <td className="px-4 py-2">{li.description}</td>
                <td className="px-4 py-2">{li.quantity}</td>
                <td className="px-4 py-2">{Number(li.unitPrice).toFixed(2)} €</td>
                <td className="px-4 py-2">{Number(li.lineTotal).toFixed(2)} €</td>
              </tr>
            ))}
            {Number(invoice.laborHours) > 0 && (
              <tr className="border-b border-border">
                <td className="px-4 py-2">
                  Main d&apos;œuvre ({Number(invoice.laborHours)} h ×{" "}
                  {Number(invoice.laborRateSnapshot).toFixed(2)} €)
                </td>
                <td className="px-4 py-2">—</td>
                <td className="px-4 py-2">—</td>
                <td className="px-4 py-2">
                  {(Number(invoice.laborHours) * Number(invoice.laborRateSnapshot)).toFixed(2)} €
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="space-y-1 border-t border-border p-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Sous-total</span>
            <span>{Number(invoice.subtotal).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>TVA ({Number(invoice.taxRateSnapshot)}%)</span>
            <span>{Number(invoice.taxAmount).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-base font-bold text-foreground">
            <span>Total</span>
            <span>{Number(invoice.total).toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
