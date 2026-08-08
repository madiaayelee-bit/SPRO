import { InfoPageShell, InfoSection } from "@/app/components/marketing/InfoPageShell";

export const metadata = { title: "Pourquoi Garage Pro ?" };

export default function PourquoiPage() {
  return (
    <InfoPageShell
      eyebrow="🎯 Pourquoi Garage Pro ?"
      title="Pourquoi Garage Pro ?"
      intro="Un garage bien tenu, c’est un garage où l’on retrouve une information en quelques secondes plutôt qu’en fouillant des carnets et des fichiers dispersés."
    >
      <InfoSection title="Ce que Garage Pro vous aide à faire">
        <ul className="list-disc space-y-2 pl-5">
          <li>Centraliser les informations du garage — clients, véhicules, réparations, stock, devis et factures au même endroit.</li>
          <li>Mieux suivre chaque véhicule — historique complet des interventions, garanties, pièces changées.</li>
          <li>Organiser les interventions — statut clair de chaque réparation, rendez-vous, mécanicien assigné.</li>
          <li>Gagner du temps sur les devis et factures — calcul automatique, conversion en un clic.</li>
          <li>Suivre les paiements — historique des transactions, statut clair (en attente, réussi, échoué...).</li>
          <li>Avoir une vue d’ensemble simple de l’activité du garage, sans tableur à mettre à jour à la main.</li>
        </ul>
      </InfoSection>

      <InfoSection title="Pensé pour le terrain">
        <p>
          Garages automobiles, ateliers de réparation moto, centres automobiles, professionnels
          indépendants : Garage Pro s’utilise aussi bien au poste fixe de l’atelier que sur un
          téléphone dans la poche, entre deux véhicules.
        </p>
      </InfoSection>

      <InfoSection title="Ce que nous ne promettons pas">
        <p>
          Garage Pro est un outil de gestion — il organise votre activité, il ne remplace pas
          votre expertise mécanique ni ne garantit à lui seul plus de clients ou plus de chiffre
          d’affaires. Ce que nous vous promettons : une information toujours à jour et accessible,
          pour vous et votre équipe.
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}
