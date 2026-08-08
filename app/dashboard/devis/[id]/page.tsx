import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffSession } from "@/lib/session";
import { getQuote } from "@/lib/db/quotes";
import { QuoteActions } from "./QuoteActions";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyé",
  ACCEPTED: "Accepté",
  REFUSED: "Refusé",
  CANCELLED: "Annulé",
};

export default async function DevisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { garageId } = await requireStaffSession();
  const { id } = await params;
  const quote = await getQuote(garageId, id);

  if (!quote) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/dashboard/devis" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
            ← Devis
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{quote.number}</h1>
          <Link
            href={`/dashboard/clients/${quote.clientId}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {quote.client.firstName} {quote.client.lastName}
          </Link>
          <p className="text-sm text-muted-foreground/70">{STATUS_LABELS[quote.status]}</p>
        </div>
        <QuoteActions id={quote.id} status={quote.status} />
      </div>

      {quote.invoice && (
        <p className="rounded-md border border-success/30 bg-success px-3 py-2 text-sm text-success-foreground">
          Converti en facture{" "}
          <Link href={`/dashboard/factures/${quote.invoice.id}`} className="underline">
            {quote.invoice.number}
          </Link>
        </p>
      )}

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
            {quote.lineItems.map((li) => (
              <tr key={li.id} className="border-b border-border last:border-0">
                <td className="px-4 py-2">{li.description}</td>
                <td className="px-4 py-2">{li.quantity}</td>
                <td className="px-4 py-2">{Number(li.unitPrice).toFixed(2)} €</td>
                <td className="px-4 py-2">{Number(li.lineTotal).toFixed(2)} €</td>
              </tr>
            ))}
            {Number(quote.laborHours) > 0 && (
              <tr className="border-b border-border">
                <td className="px-4 py-2">
                  Main d&apos;œuvre ({Number(quote.laborHours)} h ×{" "}
                  {Number(quote.laborRateSnapshot).toFixed(2)} €)
                </td>
                <td className="px-4 py-2">—</td>
                <td className="px-4 py-2">—</td>
                <td className="px-4 py-2">
                  {(Number(quote.laborHours) * Number(quote.laborRateSnapshot)).toFixed(2)} €
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="space-y-1 border-t border-border p-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Sous-total</span>
            <span>{Number(quote.subtotal).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>TVA ({Number(quote.taxRateSnapshot)}%)</span>
            <span>{Number(quote.taxAmount).toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-base font-bold text-foreground">
            <span>Total</span>
            <span>{Number(quote.total).toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
