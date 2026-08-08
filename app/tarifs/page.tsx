import Link from "next/link";
import { PLAN_LABELS, PLAN_LIMITS, formatPlanPrice } from "@/lib/plans";
import { MarketingHeader } from "@/app/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/app/components/marketing/MarketingFooter";

export default function TarifsPage() {
  return (
    <div className="min-h-screen bg-background">
    <MarketingHeader />
    <main className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">Des formules simples</h1>
        <p className="mt-2 text-muted-foreground">Changez de formule à tout moment.</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {(["FREE", "PRO", "PREMIUM"] as const).map((tier) => (
          <div
            key={tier}
            className={`rounded-2xl border p-6 ${
              tier === "PRO" ? "border-primary/50 shadow-md" : "border-border"
            }`}
          >
            <p className="text-sm font-semibold uppercase text-primary">
              {PLAN_LABELS[tier]}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatPlanPrice(tier)}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                {PLAN_LIMITS[tier].maxClients === Infinity
                  ? "Clients illimités"
                  : `Jusqu'à ${PLAN_LIMITS[tier].maxClients} clients`}
              </li>
              <li>
                {PLAN_LIMITS[tier].maxStaffUsers === Infinity
                  ? "Utilisateurs illimités"
                  : `${PLAN_LIMITS[tier].maxStaffUsers} utilisateur(s) de l'équipe`}
              </li>
              <li>
                {PLAN_LIMITS[tier].maxPhotosPerRepair} photos par réparation
              </li>
              <li>{PLAN_LIMITS[tier].clientPortal ? "Portail client inclus" : "Sans portail client"}</li>
              <li>{PLAN_LIMITS[tier].pdfExport ? "Export PDF des documents" : "Sans export PDF"}</li>
            </ul>
            <Link
              href="/inscription"
              className="mt-6 block rounded-md bg-foreground px-4 py-2 text-center text-sm font-semibold text-background hover:bg-foreground/90"
            >
              Commencer
            </Link>
          </div>
        ))}
      </div>
    </main>
    <MarketingFooter />
    </div>
  );
}
