import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { listVehicles } from "@/lib/db/vehicles";
import { RepairOrderForm } from "./RepairOrderForm";

export default async function NouvelleReparationPage() {
  const { garageId } = await requireStaffSession();
  const vehicles = await listVehicles(garageId);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/reparations"
          className="text-sm text-muted-foreground/70 hover:text-muted-foreground"
        >
          ← Réparations
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Nouvelle réparation</h1>
      </div>

      {vehicles.length === 0 ? (
        <div className="max-w-lg rounded-xl border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun véhicule enregistré.{" "}
          <Link href="/dashboard/clients" className="text-primary hover:underline">
            Ajoutez d&apos;abord un client et son véhicule
          </Link>
          .
        </div>
      ) : (
        <RepairOrderForm vehicles={vehicles} />
      )}
    </div>
  );
}
