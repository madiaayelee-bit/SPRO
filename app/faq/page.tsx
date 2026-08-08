import Link from "next/link";
import { InfoPageShell } from "@/app/components/marketing/InfoPageShell";
import { SUPPORT_EMAIL } from "@/lib/site-info";

export const metadata = { title: "FAQ — Garage Pro" };

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "Comment créer mon garage ?",
    a: "Depuis la page d’inscription, renseignez le nom de votre garage puis votre compte propriétaire. Votre garage démarre automatiquement en formule Gratuite.",
  },
  {
    q: "Comment ajouter un client ?",
    a: "Dans Clients → Nouveau client, renseignez au minimum le prénom et le nom.",
  },
  {
    q: "Comment ajouter un véhicule ?",
    a: "Depuis la fiche d’un client, cliquez sur « Ajouter un véhicule » et renseignez marque, modèle et plaque d’immatriculation.",
  },
  {
    q: "Comment créer une intervention ?",
    a: "Dans Réparations → Nouvelle réparation, choisissez le véhicule concerné et décrivez l’intervention.",
  },
  {
    q: "Comment créer un devis ?",
    a: "Dans Devis → Nouveau devis, sélectionnez le client, ajoutez les lignes de pièces/prestations et les heures de main d’œuvre : le total est calculé automatiquement.",
  },
  {
    q: "Comment créer une facture ?",
    a: "Une facture se crée en convertissant un devis marqué Accepté (bouton « Convertir en facture » sur la fiche du devis) — il n’y a pas de création de facture indépendante d’un devis à ce jour.",
  },
  {
    q: "Comment enregistrer un paiement ?",
    a: (
      <>
        Pour une facture émise à un client, marquez-la « Payée » depuis sa fiche. Pour votre
        propre abonnement Garage Pro, réglez-le par carte ou mobile money depuis{" "}
        <Link href="/dashboard/parametres/abonnement" className="text-primary hover:underline">
          Paramètres → Abonnement
        </Link>
        .
      </>
    ),
  },
  {
    q: "Comment consulter l’historique d’un véhicule ?",
    a: "Ouvrez la fiche du véhicule (depuis la fiche client) : ses réparations passées y sont listées.",
  },
  {
    q: "Comment fonctionne l’abonnement ?",
    a: "Trois formules existent : Gratuite, Pro et Premium, avec des limites différentes (nombre de clients, d’utilisateurs, accès au portail client...). Vous pouvez changer de formule à tout moment depuis Paramètres → Abonnement.",
  },
  {
    q: "Quels moyens de paiement sont disponibles ?",
    a: "La carte bancaire (Stripe) et, en Afrique de l’Ouest, le mobile money via PayDunya (Orange Money, Wave, Free Money selon le pays). Les deux nécessitent une configuration par l’éditeur avant d’être réellement actifs sur votre compte.",
  },
  {
    q: "Comment contacter le support ?",
    a: (
      <>
        Via la{" "}
        <Link href="/contact" className="text-primary hover:underline">
          page Contact
        </Link>{" "}
        ou par email à {SUPPORT_EMAIL}.
      </>
    ),
  },
  {
    q: "Comment supprimer mon compte ?",
    a: "La suppression en libre-service n’existe pas encore : contactez-nous pour en faire la demande, elle sera traitée manuellement.",
  },
];

export default function FaqPage() {
  return (
    <InfoPageShell eyebrow="❓ FAQ" title="Questions fréquentes">
      <div className="space-y-6">
        {FAQS.map((item) => (
          <div key={item.q} className="border-b border-border pb-6 last:border-0">
            <h2 className="font-semibold text-foreground">{item.q}</h2>
            <p className="mt-2 text-muted-foreground">{item.a}</p>
          </div>
        ))}
      </div>
    </InfoPageShell>
  );
}
