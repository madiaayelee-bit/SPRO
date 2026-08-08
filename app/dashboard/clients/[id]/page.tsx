import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffSession } from "@/lib/session";
import { getClient } from "@/lib/db/clients";
import { PortalInviteButton } from "./PortalInviteButton";

const VEHICLE_TYPE_LABELS: Record<string, string> = {
  CAR: "Voiture",
  MOTORCYCLE: "Moto",
};

export default async function ClientDetailPage({
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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/dashboard/clients" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
            ← Clients
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-foreground">
            {client.firstName} {client.lastName}
          </h1>
        </div>
        <Link
          href={`/dashboard/clients/${client.id}/modifier`}
          className="rounded-md border border-input bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
        >
          Modifier
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <InfoCard label="Téléphone" value={client.phone} />
        <InfoCard label="Email" value={client.email} />
        <InfoCard label="Adresse" value={client.address} />
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card p-5">
        <p className="text-sm">
          Accès portail client :{" "}
          {client.portalAccount ? (
            <span className="font-medium text-green-700">Activé</span>
          ) : (
            <span className="text-muted-foreground">Non activé</span>
          )}
        </p>
        {!client.portalAccount && (
          <>
            {client.email ? (
              <PortalInviteButton clientId={client.id} />
            ) : (
              <p className="text-sm text-muted-foreground/70">
                Ajoutez un email au client pour pouvoir activer le portail.
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Véhicules</h2>
        <Link
          href={`/dashboard/clients/${client.id}/vehicules/nouveau`}
          className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:bg-foreground/90"
        >
          + Ajouter un véhicule
        </Link>
      </div>

      {client.vehicles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun véhicule enregistré.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {client.vehicles.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/dashboard/clients/${client.id}/vehicules/${vehicle.id}/modifier`}
              className="rounded-xl border border-border bg-card p-4 hover:border-primary/40"
            >
              <p className="text-xs font-medium uppercase text-muted-foreground/70">
                {VEHICLE_TYPE_LABELS[vehicle.type]}
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {vehicle.make} {vehicle.model}
              </p>
              <p className="text-sm text-muted-foreground">{vehicle.plateNumber}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground/70">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value || "—"}</p>
    </div>
  );
}
