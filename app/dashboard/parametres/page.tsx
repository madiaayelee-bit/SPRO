import Link from "next/link";
import { requireStaffSession } from "@/lib/session";

export default async function ParametresPage() {
  await requireStaffSession();

  const links = [
    {
      href: "/dashboard/parametres/equipe",
      label: "Équipe",
      description: "Inviter des employés et gérer les accès",
    },
    {
      href: "/dashboard/parametres/abonnement",
      label: "Abonnement",
      description: "Formule, facturation et moyens de paiement",
    },
    {
      href: "/dashboard/parametres/apparence",
      label: "Apparence",
      description: "Thème clair, sombre ou automatique",
    },
    {
      href: "/dashboard/parametres/informations",
      label: "Informations",
      description: "À propos, confidentialité, conditions, aide et contact",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary/40"
          >
            <p className="font-semibold text-foreground">{link.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
