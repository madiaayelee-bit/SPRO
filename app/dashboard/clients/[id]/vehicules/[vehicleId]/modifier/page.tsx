import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffSession } from "@/lib/session";
import { getVehicle } from "@/lib/db/vehicles";
import { updateVehicleAction } from "@/lib/actions/vehicles";
import { VehicleForm } from "@/app/components/VehicleForm";

export default async function ModifierVehiculePage({
  params,
}: {
  params: Promise<{ id: string; vehicleId: string }>;
}) {
  const { garageId } = await requireStaffSession();
  const { id, vehicleId } = await params;
  const vehicle = await getVehicle(garageId, vehicleId);

  if (!vehicle || vehicle.clientId !== id) {
    notFound();
  }

  const action = updateVehicleAction.bind(null, vehicleId, id);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/dashboard/clients/${id}`}
          className="text-sm text-muted-foreground/70 hover:text-muted-foreground"
        >
          ← {vehicle.client.firstName} {vehicle.client.lastName}
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">
          {vehicle.make} {vehicle.model}
        </h1>
      </div>
      <VehicleForm action={action} defaultValues={vehicle} submitLabel="Enregistrer" />

      {vehicle.repairOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground">Historique des réparations</h2>
          <div className="mt-3 space-y-2">
            {vehicle.repairOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/reparations/${order.id}`}
                className="block rounded-lg border border-border bg-card p-3 text-sm hover:border-primary/40"
              >
                {order.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
