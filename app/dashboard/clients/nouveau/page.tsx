import Link from "next/link";
import { ClientForm } from "@/app/components/ClientForm";
import { createClientAction } from "@/lib/actions/clients";

export default function NouveauClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/clients" className="text-sm text-muted-foreground/70 hover:text-muted-foreground">
          ← Clients
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Nouveau client</h1>
      </div>
      <ClientForm action={createClientAction} submitLabel="Créer le client" />
    </div>
  );
}
