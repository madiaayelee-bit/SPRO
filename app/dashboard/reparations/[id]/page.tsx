import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireStaffSession } from "@/lib/session";
import { getRepairOrder } from "@/lib/db/repair-orders";
import { listInventory } from "@/lib/db/inventory";
import { StatusSelector } from "./StatusSelector";
import { PhotoUpload } from "./PhotoUpload";
import { PartsUsedForm } from "./PartsUsedForm";

export default async function ReparationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { garageId } = await requireStaffSession();
  const { id } = await params;
  const [order, inventory] = await Promise.all([
    getRepairOrder(garageId, id),
    listInventory(garageId),
  ]);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/reparations"
            className="text-sm text-muted-foreground/70 hover:text-muted-foreground"
          >
            ← Réparations
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{order.title}</h1>
          <Link
            href={`/dashboard/clients/${order.vehicle.clientId}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            {order.vehicle.client.firstName} {order.vehicle.client.lastName} —{" "}
            {order.vehicle.make} {order.vehicle.model} ({order.vehicle.plateNumber})
          </Link>
        </div>
        <StatusSelector id={order.id} currentStatus={order.status} />
      </div>

      {order.description && (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-foreground">
          {order.description}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <InfoBlock
          label="Rendez-vous"
          value={
            order.appointmentDate
              ? new Date(order.appointmentDate).toLocaleString("fr-FR")
              : "—"
          }
        />
        <InfoBlock
          label="Date de sortie"
          value={
            order.completionDate
              ? new Date(order.completionDate).toLocaleDateString("fr-FR")
              : "—"
          }
        />
        <InfoBlock
          label="Durée estimée"
          value={order.estimatedDurationMin ? `${order.estimatedDurationMin} min` : "—"}
        />
        <InfoBlock
          label="Garantie"
          value={order.warrantyMonths ? `${order.warrantyMonths} mois` : "—"}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Photos</h2>
          <PhotoUpload repairOrderId={order.id} />
        </div>
        {order.photos.length === 0 ? (
          <p className="text-sm text-muted-foreground/70">Aucune photo pour l&apos;instant.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
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
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Pièces utilisées</h2>
        {order.partsUsed.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <tbody>
                {order.partsUsed.map((usage) => (
                  <tr key={usage.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2">{usage.inventoryItem.name}</td>
                    <td className="px-4 py-2 text-muted-foreground">× {usage.quantity}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {Number(usage.unitPriceAtUse).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <PartsUsedForm
          repairOrderId={order.id}
          inventory={inventory.map((item) => ({
            id: item.id,
            name: item.name,
            quantityInStock: item.quantityInStock,
          }))}
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        {order.quote || order.invoice ? (
          <div className="flex flex-wrap gap-3 text-sm">
            {order.quote && (
              <Link
                href={`/dashboard/devis/${order.quote.id}`}
                className="text-primary hover:underline"
              >
                Voir le devis {order.quote.number}
              </Link>
            )}
            {order.invoice && (
              <Link
                href={`/dashboard/factures/${order.invoice.id}`}
                className="text-primary hover:underline"
              >
                Voir la facture {order.invoice.number}
              </Link>
            )}
          </div>
        ) : (
          <Link
            href={`/dashboard/devis/nouveau?repairOrderId=${order.id}&clientId=${order.vehicle.clientId}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            + Créer un devis pour cette réparation
          </Link>
        )}
      </div>
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
