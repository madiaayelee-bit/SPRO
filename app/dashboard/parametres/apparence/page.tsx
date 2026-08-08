import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export default async function ApparencePage() {
  await requireStaffSession();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/parametres"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Paramètres
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Apparence</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choisissez le thème de Garage Pro. Votre choix est mémorisé sur cet appareil.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <ThemeToggle variant="full" />
      </div>
    </div>
  );
}
