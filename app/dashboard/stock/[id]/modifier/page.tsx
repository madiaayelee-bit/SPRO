import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffSession } from "@/lib/session";
import { getInventoryItem } from "@/lib/db/inventory";
import { updateInventoryItemAction } from "@/lib/actions/inventory";
import { InventoryItemForm } from "@/app/components/InventoryItemForm";

export default async function ModifierPiecePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { garageId } = await requireStaffSession();
  const { id } = await params;
  const item = await getInventoryItem(garageId, id);

  if (!item) {
    notFound();
  }

  const action = updateInventoryItemAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/stock" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
          ← Stock
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">{item.name}</h1>
      </div>
      <InventoryItemForm
        action={action}
        defaultValues={{
          name: item.name,
          reference: item.reference,
          unitPrice: Number(item.unitPrice),
          quantityInStock: item.quantityInStock,
          lowStockThreshold: item.lowStockThreshold,
        }}
        submitLabel="Enregistrer"
      />
    </div>
  );
}
