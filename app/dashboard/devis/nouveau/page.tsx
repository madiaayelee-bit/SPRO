import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { listClients } from "@/lib/db/clients";
import { prisma } from "@/lib/prisma";
import { QuoteForm } from "./QuoteForm";

export default async function NouveauDevisPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; repairOrderId?: string }>;
}) {
  const { garageId } = await requireStaffSession();
  const { clientId, repairOrderId } = await searchParams;
  const [clients, settings] = await Promise.all([
    listClients(garageId),
    prisma.garageSettings.findUniqueOrThrow({ where: { garageId } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/devis" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
          ← Devis
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Nouveau devis</h1>
      </div>

      {clients.length === 0 ? (
        <div className="max-w-lg rounded-xl border border-dashed border-input bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun client enregistré.{" "}
          <Link href="/dashboard/clients/nouveau" className="text-primary hover:underline">
            Ajoutez d&apos;abord un client
          </Link>
          .
        </div>
      ) : (
        <QuoteForm
          clients={clients}
          hourlyRate={Number(settings.hourlyLaborRate)}
          defaultClientId={clientId}
          defaultRepairOrderId={repairOrderId}
        />
      )}
    </div>
  );
}
