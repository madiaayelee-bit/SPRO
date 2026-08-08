import Link from "next/link";
import { requireClientSession } from "@/lib/session";
import { listMyVehicles } from "@/lib/db/portal";

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  CAR: "Voiture",
  MOTORCYCLE: "Moto",
};

const REPAIR_STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Reçu",
  DIAGNOSED: "Diagnostiqué",
  IN_PROGRESS: "En cours",
  WAITING_PARTS: "Attente pièces",
  READY: "Prêt",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

export default async function PortalHomePage() {
  const { garageId, clientId, name } = await requireClientSession();
  const vehicles = await listMyVehicles(garageId, clientId);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-foreground">Bonjour, {name} 👋</h1>

      {vehicles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun véhicule enregistré pour l&apos;instant.
        </div>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground/70">
                {VEHICLE_TYPE_LABELS[vehicle.type]}
              </p>
              <p className="font-semibold text-foreground">
                {vehicle.make} {vehicle.model} — {vehicle.plateNumber}
              </p>
              {vehicle.repairOrders.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground/70">Aucune réparation.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  {vehicle.repairOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/portail/reparations/${order.id}`}
                      className="flex items-center justify-between rounded-lg border border-border p-2 text-sm hover:border-primary/40"
                    >
                      <span>{order.title}</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {REPAIR_STATUS_LABELS[order.status]}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
