import Link from "next/link";
import { InfoPageShell, InfoSection } from "@/app/components/marketing/InfoPageShell";
import { SUPPORT_EMAIL } from "@/lib/site-info";

export const metadata = { title: "Politique de confidentialité — Garage Pro" };

export default function ConfidentialitePage() {
  return (
    <InfoPageShell eyebrow="🔐 Confidentialité" title="Politique de confidentialité">
      <InfoSection title="Données collectées">
        <p>Selon votre usage de Garage Pro, nous stockons :</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Compte garage</strong> — nom du garage, téléphone, email, adresse, SIRET
            (optionnel).
          </li>
          <li>
            <strong>Comptes utilisateurs</strong> — email, mot de passe (haché, jamais stocké en
            clair), prénom, nom, rôle.
          </li>
          <li>
            <strong>Clients de votre garage</strong> — nom, prénom, adresse, téléphone, email
            (ceux que vous renseignez vous-même).
          </li>
          <li>
            <strong>Véhicules</strong> — marque, modèle, plaque d’immatriculation, numéro de
            châssis, année, kilométrage.
          </li>
          <li>
            <strong>Réparations</strong> — description de l’intervention, statut, dates, garantie,
            photos éventuellement ajoutées.
          </li>
          <li>
            <strong>Devis et factures</strong> — montants, lignes de prestations/pièces, statut de
            paiement.
          </li>
          <li>
            <strong>Transactions de paiement</strong> — montant, devise, moyen de paiement, et
            pour le mobile money, le numéro de téléphone utilisé pour la transaction.
          </li>
          <li>
            <strong>Messages de contact</strong> — nom, email, téléphone (optionnel), message,
            si vous utilisez notre formulaire de contact.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Utilisation">
        <p>Ces données servent uniquement au fonctionnement de Garage Pro :</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>gérer vos clients, véhicules et interventions ;</li>
          <li>calculer et émettre vos devis et factures ;</li>
          <li>traiter les paiements de votre abonnement ;</li>
          <li>faire fonctionner votre compte et vos accès (authentification) ;</li>
          <li>sécuriser l’application (détection d’abus, isolation entre garages) ;</li>
          <li>répondre à vos messages de contact.</li>
        </ul>
      </InfoSection>

      <InfoSection title="Conservation">
        <p>
          Vos données sont conservées tant que votre compte reste actif. Garage Pro ne dispose
          pas encore d’une suppression de compte en libre-service ; voir la section « Suppression »
          ci-dessous pour en faire la demande.
        </p>
      </InfoSection>

      <InfoSection title="Partage avec des tiers">
        <p>Garage Pro s’appuie sur les prestataires techniques suivants :</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Base de données</strong> — hébergement PostgreSQL pour stocker les données
            décrites ci-dessus.
          </li>
          <li>
            <strong>Stripe</strong> — pour les paiements par carte bancaire, lorsque cette formule
            est activée.
          </li>
          <li>
            <strong>PayDunya</strong> — pour les paiements mobile money en Afrique de l’Ouest,
            lorsque cette formule est activée.
          </li>
        </ul>
        <p>
          Nous n’utilisons aucun outil d’analytics ou de publicité tiers, et n’envoyons pas
          automatiquement d’e-mails à ce jour.
        </p>
      </InfoSection>

      <InfoSection title="Sécurité">
        <p>Mesures en place : mots de passe hachés, isolation stricte des données entre garages, limitation du nombre de tentatives de connexion, en-têtes de sécurité HTTP, vérification de signature des paiements. Aucune mesure de sécurité ne peut garantir une protection absolue ; nous travaillons à maintenir ces protections à jour.</p>
      </InfoSection>

      <InfoSection title="Cookies">
        <p>
          Garage Pro utilise un unique cookie, strictement nécessaire au fonctionnement du
          service : le cookie de session qui vous garde connecté. Il n’est pas utilisé à des fins
          publicitaires ou de suivi, et n’est pas partagé avec des tiers.
        </p>
      </InfoSection>

      <InfoSection title="Suppression de vos données">
        <p>
          Pour demander la suppression de vos données, contactez-nous via la{" "}
          <Link href="/contact" className="text-primary hover:underline">
            page Contact
          </Link>{" "}
          ou à{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
            {SUPPORT_EMAIL}
          </a>
          . Cette demande est traitée manuellement à ce jour.
        </p>
      </InfoSection>

      <p className="pt-4 text-sm text-muted-foreground/70">Dernière mise à jour : août 2026</p>
    </InfoPageShell>
  );
}
