import { InfoPageShell, InfoSection } from "@/app/components/marketing/InfoPageShell";

export const metadata = { title: "Guide — Comment utiliser Garage Pro" };

const STEPS = [
  {
    title: "1. Créer son compte",
    body: "Depuis la page d’inscription, créez votre garage : nom, téléphone, puis votre compte propriétaire (prénom, nom, email, mot de passe). Vous êtes automatiquement connecté et redirigé vers votre tableau de bord, en formule Gratuite.",
  },
  {
    title: "2. Ajouter un client",
    body: "Dans Clients → Nouveau client, renseignez prénom, nom, et selon les cas adresse, téléphone, email. Le client apparaît ensuite dans votre liste, avec ses véhicules.",
  },
  {
    title: "3. Ajouter un véhicule",
    body: "Depuis la fiche d’un client → Ajouter un véhicule : type (voiture ou moto), marque, modèle, plaque d’immatriculation, et si besoin numéro de châssis (VIN), année, kilométrage.",
  },
  {
    title: "4. Créer une réparation",
    body: "Dans Réparations → Nouvelle réparation, choisissez le véhicule, décrivez l’intervention, et renseignez si besoin le rendez-vous, la durée estimée et la garantie. Le statut se met à jour au fil de l’avancement (reçu, diagnostiqué, en cours, prêt, terminé...).",
  },
  {
    title: "5. Utiliser une pièce du stock",
    body: "Sur la fiche d’une réparation, sélectionnez une pièce de votre stock et sa quantité : le stock est automatiquement décrémenté et le prix de la pièce à ce moment-là est conservé pour la facturation.",
  },
  {
    title: "6. Créer un devis",
    body: "Dans Devis → Nouveau devis, choisissez le client, les heures de main d’œuvre et les lignes de prestation/pièces. Le total (main d’œuvre + pièces + TVA) est calculé automatiquement.",
  },
  {
    title: "7. Transformer le devis en facture",
    body: "Une fois le devis marqué Accepté, un bouton « Convertir en facture » apparaît sur sa fiche : la facture reprend exactement les mêmes lignes et montants.",
  },
  {
    title: "8. Suivre le paiement d’une facture",
    body: "Sur la fiche d’une facture, un bouton permet de la marquer comme payée une fois le règlement reçu du client. (Ceci concerne les factures émises à vos clients — c’est différent du paiement de votre propre abonnement Garage Pro, voir l’étape suivante.)",
  },
  {
    title: "9. Payer ou changer votre abonnement Garage Pro",
    body: "Depuis Paramètres → Abonnement, passez à une formule payante par carte bancaire (Stripe) ou, en Afrique de l’Ouest, par mobile money (Orange Money, Wave, Free Money via PayDunya). L’historique de vos paiements d’abonnement est visible sur cette même page.",
  },
  {
    title: "10. Consulter l’historique et le tableau de bord",
    body: "La fiche d’un véhicule liste ses réparations passées ; la fiche d’un client liste ses véhicules. Le tableau de bord (page d’accueil de votre espace) affiche un résumé : nombre de clients, réparations en cours, devis en attente, alertes de stock bas.",
  },
];

export default function GuidePage() {
  return (
    <InfoPageShell
      eyebrow="📱 Guide"
      title="Comment utiliser Garage Pro ?"
      intro="Le parcours de base, étape par étape."
    >
      {STEPS.map((step) => (
        <InfoSection key={step.title} title={step.title}>
          <p>{step.body}</p>
        </InfoSection>
      ))}
    </InfoPageShell>
  );
}
