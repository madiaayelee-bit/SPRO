import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { listRepairOrders } from "@/lib/db/repair-orders";
import { REPAIR_STATUS_LABELS, REPAIR_STATUSES } from "@/lib/validations/repair-orders";
import { subNavPillClass } from "@/app/components/nav/nav-styles";
import { REPAIR_STATUS_TONES, statusBadgeClass } from "@/lib/status-colors";

export default async function ReparationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { garageId } = await requireStaffSession();
  const { status } = await searchParams;
  const orders = await listRepairOrders(garageId, status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Réparations</h1>
        <Link
          href="/dashboard/reparations/nouveau"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          + Nouvelle réparation
        </Link>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrer par statut">
        <Link
          href="/dashboard/reparations"
          role="tab"
          aria-selected={!status}
          className={subNavPillClass(!status)}
        >
          Toutes
        </Link>
        {REPAIR_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/dashboard/reparations?status=${s}`}
            role="tab"
            aria-selected={status === s}
            className={subNavPillClass(status === s)}
          >
            {REPAIR_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucune réparation pour l&apos;instant.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/reparations/${order.id}`}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/40"
            >
              <span className={statusBadgeClass(REPAIR_STATUS_TONES[order.status])}>
                {REPAIR_STATUS_LABELS[order.status as keyof typeof REPAIR_STATUS_LABELS]}
              </span>
              <p className="mt-2 font-semibold text-foreground">{order.title}</p>
              <p className="text-sm text-muted-foreground">
                {order.vehicle.make} {order.vehicle.model} — {order.vehicle.client.firstName}{" "}
                {order.vehicle.client.lastName}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
