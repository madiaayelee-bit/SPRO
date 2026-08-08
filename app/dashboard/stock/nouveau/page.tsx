import Link from "next/link";
import { InventoryItemForm } from "@/app/components/InventoryItemForm";
import { createInventoryItemAction } from "@/lib/actions/inventory";

export default function NouvellePiecePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/stock" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
          ← Stock
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Nouvelle pièce</h1>
      </div>
      <InventoryItemForm action={createInventoryItemAction} submitLabel="Ajouter au stock" />
    </div>
  );
}
