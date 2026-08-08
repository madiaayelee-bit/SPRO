import { InfoPageShell, InfoSection } from "@/app/components/marketing/InfoPageShell";
import { SUPPORT_EMAIL } from "@/lib/site-info";

export const metadata = { title: "Conditions d’utilisation — Garage Pro" };

export default function ConditionsPage() {
  return (
    <InfoPageShell eyebrow="📜 Conditions" title="Conditions d’utilisation">
      <div className="rounded-lg border border-warning/30 bg-warning p-4 text-sm text-warning-foreground">
        ⚠️ Ce document est un brouillon de travail généré à partir du fonctionnement réel de
        l’application. Il contient des informations à compléter (identifiées ci-dessous) et doit
        être relu et validé par un professionnel du droit avant toute publication officielle.
      </div>

      <InfoSection title="Éditeur du service">
        <p>
          Garage Pro est édité par <strong>[Raison sociale à compléter]</strong>, dont le siège
          est situé <strong>[Adresse à compléter]</strong>, immatriculée sous le numéro{" "}
          <strong>[Numéro d’immatriculation à compléter]</strong>.
        </p>
      </InfoSection>

      <InfoSection title="Utilisation du compte et du service">
        <p>
          L’accès à Garage Pro nécessite la création d’un compte garage (propriétaire) ou une
          invitation (employé ou client). Chaque utilisateur est responsable de la confidentialité
          de ses identifiants et des actions effectuées depuis son compte.
        </p>
      </InfoSection>

      <InfoSection title="Responsabilités de l’utilisateur">
        <p>
          Le garage reste seul responsable de l’exactitude des informations qu’il saisit
          (fiches clients, véhicules, devis, factures) et du respect de ses obligations légales
          envers ses propres clients (facturation, protection des données personnelles qu’il
          collecte).
        </p>
      </InfoSection>

      <InfoSection title="Données clients et véhicules">
        <p>
          Les données de vos clients et de leurs véhicules saisies dans Garage Pro restent votre
          propriété. Garage Pro les traite pour votre compte, dans les conditions décrites par
          notre{" "}
          <a href="/confidentialite" className="text-primary hover:underline">
            politique de confidentialité
          </a>
          .
        </p>
      </InfoSection>

      <InfoSection title="Abonnements et paiements">
        <p>
          Garage Pro propose une formule Gratuite et des formules payantes (Pro, Premium),
          payables par carte bancaire ou, en Afrique de l’Ouest, par mobile money. Les tarifs
          affichés au moment du paiement font foi. [Politique de remboursement à préciser].
        </p>
      </InfoSection>

      <InfoSection title="Résiliation">
        <p>
          Vous pouvez cesser d’utiliser Garage Pro à tout moment. [Modalités précises de
          résiliation et de suppression du compte à définir — aucune suppression de compte en
          libre-service n’existe à ce jour, voir notre politique de confidentialité].
        </p>
      </InfoSection>

      <InfoSection title="Propriété intellectuelle">
        <p>
          Le logiciel Garage Pro, son code, son design et sa marque sont la propriété de son
          éditeur. Cette licence ne vous cède aucun droit sur le logiciel lui-même.
        </p>
      </InfoSection>

      <InfoSection title="Disponibilité et responsabilité">
        <p>
          Garage Pro est fourni « en l’état ». Nous mettons en œuvre des moyens raisonnables pour
          assurer la disponibilité et la sécurité du service, sans garantie d’absence totale
          d’interruption ou d’erreur. [Limitation de responsabilité à faire valider
          juridiquement].
        </p>
      </InfoSection>

      <InfoSection title="Modifications">
        <p>
          Ces conditions et le service lui-même peuvent évoluer. Les changements substantiels
          seront communiqués aux utilisateurs.
        </p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>
          Pour toute question relative à ces conditions :{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </InfoSection>

      <p className="pt-4 text-sm text-muted-foreground/70">Dernière mise à jour : août 2026</p>
    </InfoPageShell>
  );
}
