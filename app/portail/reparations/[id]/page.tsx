import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireClientSession } from "@/lib/session";
import { getMyRepairOrder } from "@/lib/db/portal";

const REPAIR_STATUS_LABELS: Record<string, string> = {
  RECEIVED: "Reçu",
  DIAGNOSED: "Diagnostiqué",
  IN_PROGRESS: "En cours",
  WAITING_PARTS: "Attente pièces",
  READY: "Prêt",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

export default async function PortalRepairOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { garageId, clientId } = await requireClientSession();
  const { id } = await params;
  const order = await getMyRepairOrder(garageId, clientId, id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link href="/portail" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
          ← Mes véhicules
        </Link>
        <h1 className="mt-1 text-xl font-bold text-foreground">{order.title}</h1>
        <p className="text-sm text-muted-foreground">
          {order.vehicle.make} {order.vehicle.model} ({order.vehicle.plateNumber})
        </p>
        <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
          {REPAIR_STATUS_LABELS[order.status]}
        </span>
      </div>

      {order.description && (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-foreground">
          {order.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <InfoBlock
          label="Date de sortie"
          value={
            order.completionDate
              ? new Date(order.completionDate).toLocaleDateString("fr-FR")
              : "—"
          }
        />
        <InfoBlock
          label="Garantie"
          value={order.warrantyMonths ? `${order.warrantyMonths} mois` : "—"}
        />
      </div>

      {order.photos.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground">Photos</h2>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {order.photos.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square overflow-hidden rounded-lg border border-border"
              >
                <Image
                  src={`/api/uploads/${photo.filePath}`}
                  alt="Photo de la réparation"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs font-medium uppercase text-muted-foreground/70">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
