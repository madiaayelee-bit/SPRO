import Link from "next/link";
import { MarketingHeader } from "@/app/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/app/components/marketing/MarketingFooter";
import { HeroPhoto } from "@/app/components/marketing/HeroPhoto";

const FEATURES = [
  {
    title: "Clients & véhicules",
    description:
      "Fiches clients complètes, historique par véhicule (marque, modèle, plaque, VIN) — retrouvez tout en deux clics.",
  },
  {
    title: "Suivi des réparations",
    description:
      "Statut en temps réel, rendez-vous, durée, garantie, photos de la panne — toute l'équipe voit où ça en est.",
  },
  {
    title: "Stock & pièces",
    description:
      "Inventaire des pièces avec alertes de stock bas, décompté automatiquement à chaque réparation.",
  },
  {
    title: "Devis & factures",
    description:
      "Calcul automatique main d'œuvre + pièces + TVA. Un devis accepté se convertit en facture en un clic.",
  },
  {
    title: "Portail client",
    description:
      "Vos clients suivent leur véhicule, consultent et acceptent leurs devis, et retrouvent leurs factures — en autonomie.",
  },
  {
    title: "Multi-utilisateurs",
    description:
      "Invitez votre équipe avec des rôles adaptés (propriétaire, manager, mécanicien) sur un même espace garage.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-paper">
      <MarketingHeader dark />

      {/* Hero — photo plein cadre de l'atelier. Tant que
          public/images/hero-mecanicien.jpg n'existe pas, <HeroPhoto /> échoue
          silencieusement et seul le dégradé ci-dessous reste visible. */}
      <section className="relative isolate flex min-h-[85vh] items-end overflow-hidden bg-gradient-to-br from-steel via-ink to-brass/20">
        <HeroPhoto />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/10"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/25 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-32 sm:px-6 sm:pb-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-brass">
              Gestion d&apos;atelier
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-paper sm:text-5xl">
              Chaque véhicule mérite une fiche bien tenue.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-paper/70">
              Clients, véhicules, réparations, stock, devis et factures — un seul carnet, du
              poste fixe de l&apos;atelier au téléphone dans la poche.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inscription"
                className="rounded-md bg-brass px-6 py-3 text-center text-sm font-semibold text-paper shadow-lg shadow-brass/30 hover:brightness-110"
              >
                Créer mon garage — gratuit
              </Link>
              <Link
                href="/tarifs"
                className="rounded-md border border-paper/30 px-6 py-3 text-center text-sm font-semibold text-paper hover:bg-white/10"
              >
                Voir les formules
              </Link>
            </div>
            <p className="mt-5 text-xs text-paper/50">
              Aucune carte bancaire requise pour la formule Gratuite.
            </p>
          </div>
        </div>
      </section>

      {/* Bandeau de repères */}
      <section className="border-y border-ink/10 bg-steel py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 text-center text-sm text-paper/50 sm:grid-cols-4 sm:px-6">
          <Metric value="100%" label="Calculs automatiques" />
          <Metric value="3" label="Formules, dont une gratuite" />
          <Metric value="24/7" label="Accessible partout" />
          <Metric value="0" label="Carte bancaire requise" />
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-brass">
            Tout l&apos;atelier, un seul outil
          </h2>
          <p className="mt-3 font-display text-3xl font-semibold text-ink">
            De la prise de rendez-vous à la facture payée
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-ink/10 bg-white p-6 transition hover:border-brass/40 hover:shadow-sm"
            >
              <span className="block h-1.5 w-8 rounded-full bg-brass/60 transition group-hover:w-12 group-hover:bg-brass" />
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section responsive / multi-appareil */}
      <section className="bg-steel">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-brass">
              Sur le pont, avec vous
            </h2>
            <p className="mt-3 font-display text-3xl font-semibold text-paper">
              Téléphone en poche, tablette sur l&apos;établi, écran au bureau.
            </p>
            <p className="mt-4 text-paper/60">
              L&apos;interface s&apos;adapte à l&apos;endroit où vous travaillez réellement —
              navigation basse sur mobile, barre latérale au bureau, rien à installer.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <DeviceFrame label="Mobile" width="w-24" height="h-44" />
            <DeviceFrame label="Tablette" width="w-36" height="h-52" />
            <DeviceFrame label="Bureau" width="w-56" height="h-40" />
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
        <h2 className="font-display text-3xl font-semibold text-ink">Des formules simples</h2>
        <p className="mt-2 text-ink/55">
          Commencez gratuitement, évoluez quand votre garage grandit.
        </p>
        <Link
          href="/tarifs"
          className="mt-8 inline-block rounded-md bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink/90"
        >
          Voir les tarifs
        </Link>
      </section>

      <MarketingFooter />
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-xl font-semibold text-paper">{value}</p>
      <p className="mt-0.5">{label}</p>
    </div>
  );
}

function DeviceFrame({
  label,
  width,
  height,
}: {
  label: string;
  width: string;
  height: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${width} ${height} rounded-xl border border-paper/15 bg-ink/40 p-2 shadow-inner`}>
        <div className="h-full w-full rounded-md border border-paper/10 bg-gradient-to-br from-ink/30 to-ink/60" />
      </div>
      <span className="text-xs font-medium text-paper/40">{label}</span>
    </div>
  );
}
