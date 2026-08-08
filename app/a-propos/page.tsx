import { InfoPageShell, InfoSection } from "@/app/components/marketing/InfoPageShell";
import { APP_VERSION } from "@/lib/site-info";

export const metadata = { title: "À propos — Garage Pro" };

export default function AProposPage() {
  return (
    <InfoPageShell
      eyebrow="🏢 À propos"
      title="À propos de Garage Pro"
      intro="Garage Pro est un logiciel de gestion pensé pour les garages automobiles et moto — de la fiche client à la facture, sur téléphone, tablette ou ordinateur."
    >
      <InfoSection title="Ce que permet Garage Pro aujourd’hui">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Clients</strong> — fiches clients complètes (nom, coordonnées, adresse) et
            historique de leurs véhicules.
          </li>
          <li>
            <strong>Véhicules</strong> — fiche par véhicule (marque, modèle, plaque, numéro de
            châssis, année, kilométrage), rattachée à son propriétaire.
          </li>
          <li>
            <strong>Réparations et interventions</strong> — suivi de statut (reçu, diagnostiqué,
            en cours, prêt, terminé...), rendez-vous, garantie, mécanicien assigné, photos de la
            panne.
          </li>
          <li>
            <strong>Stock et pièces</strong> — inventaire des pièces avec alerte de stock bas,
            décompté automatiquement lorsqu’une pièce est utilisée sur une réparation.
          </li>
          <li>
            <strong>Devis et factures</strong> — calcul automatique (main d’œuvre + pièces + TVA),
            conversion d’un devis accepté en facture en un clic, numérotation automatique.
          </li>
          <li>
            <strong>Paiements</strong> — abonnement du garage payable par carte (Stripe) ou par
            mobile money en Afrique de l’Ouest (PayDunya).
          </li>
          <li>
            <strong>Portail client</strong> — vos clients peuvent suivre leur véhicule, consulter
            et accepter leurs devis, et retrouver leurs factures.
          </li>
          <li>
            <strong>Équipe</strong> — invitation de collaborateurs (manager, mécanicien) avec des
            accès adaptés à leur rôle.
          </li>
          <li>
            <strong>Tableau de bord</strong> — vue d’ensemble simple : nombre de clients,
            réparations en cours, devis en attente, alertes de stock.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Pour qui ?">
        <p>
          Garage Pro s’adresse aux garages automobiles et moto, ateliers de réparation et
          professionnels indépendants qui veulent centraliser la gestion de leur activité sans
          jongler entre plusieurs outils.
        </p>
      </InfoSection>

      <p className="pt-4 text-sm text-muted-foreground/70">Garage Pro — version {APP_VERSION}</p>
    </InfoPageShell>
  );
}
