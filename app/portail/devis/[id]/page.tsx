import Link from "next/link";
import { notFound } from "next/navigation";
import { requireClientSession } from "@/lib/session";
import { getMyQuote } from "@/lib/db/portal";
import { QuoteResponseButtons } from "./QuoteResponseButtons";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "En attente de votre réponse",
  ACCEPTED: "Accepté",
  REFUSED: "Refusé",
  CANCELLED: "Annulé",
};

export default async function PortalQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { garageId, clientId } = await requireClientSession();
  const { id } = await params;
  const quote = await getMyQuote(garageId, clientId, id);

  if (!quote) {
    notFound();
  }

  const canRespond = quote.status === "DRAFT" || quote.status === "SENT";

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/portail/devis" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
          ← Mes devis
        </Link>
        <h1 className="mt-1 text-xl font-bold text-foreground">{quote.number}</h1>
        <p className="text-sm text-muted-foreground">{STATUS_LABELS[quote.status]}</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-background text-muted-foreground">
            <tr>
              <th className="px-4 py-2 font-medium">Description</th>
              <th className="px-4 py-2 font-medium">Qté</th>
              <th className="px-4 py-2 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {quote.lineItems.map((li) => (
              <tr key={li.id} className="border-b border-border last:border-0">
                <td className="px-4 py-2">{li.description}</td>
                <td className="px-4 py-2">{li.quantity}</td>
                <td className="px-4 py-2">{Number(li.lineTotal).toFixed(2)} €</td>
              </tr>
            ))}
            {Number(quote.laborHours) > 0 && (
              <tr className="border-b border-border">
                <td className="px-4 py-2">Main d&apos;œuvre ({Number(quote.laborHours)} h)</td>
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

      {canRespond && <QuoteResponseButtons quoteId={quote.id} />}
    </div>
  );
}
