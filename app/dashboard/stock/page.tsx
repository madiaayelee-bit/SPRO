import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { listInventory } from "@/lib/db/inventory";

export default async function StockPage() {
  const { garageId } = await requireStaffSession();
  const items = await listInventory(garageId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Stock</h1>
        <Link
          href="/dashboard/stock/nouveau"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          + Nouvelle pièce
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
          Aucune pièce en stock.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-background text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Pièce</th>
                <th className="px-4 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium">Prix unitaire</th>
                <th className="px-4 py-3 font-medium">Quantité</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const low = item.quantityInStock <= item.lowStockThreshold;
                return (
                  <tr
                    key={item.id}
                    className="border-b border-border last:border-0 hover:bg-background"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/stock/${item.id}/modifier`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.reference || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {Number(item.unitPrice).toFixed(2)} €
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          low
                            ? "rounded-full bg-danger px-2 py-0.5 text-xs font-semibold text-danger-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {item.quantityInStock}
                        {low && " — stock bas"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
