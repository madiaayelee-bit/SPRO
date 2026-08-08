import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffSession } from "@/lib/session";
import { getClient } from "@/lib/db/clients";
import { createVehicleAction } from "@/lib/actions/vehicles";
import { VehicleForm } from "@/app/components/VehicleForm";

export default async function NouveauVehiculePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { garageId } = await requireStaffSession();
  const { id } = await params;
  const client = await getClient(garageId, id);

  if (!client) {
    notFound();
  }

  const action = createVehicleAction.bind(null, id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/clients/${id}`}
          className="text-sm text-muted-foreground/70 hover:text-muted-foreground"
        >
          ← {client.firstName} {client.lastName}
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Nouveau véhicule</h1>
      </div>
      <VehicleForm action={action} submitLabel="Ajouter le véhicule" />
    </div>
  );
}
