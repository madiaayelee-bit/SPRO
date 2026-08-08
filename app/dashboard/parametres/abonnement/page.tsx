import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/payments/providers/stripe";
import { PLAN_LABELS, PLAN_LIMITS, formatPlanPrice } from "@/lib/plans";
import { UpgradeButton, ManageBillingButton } from "./UpgradeButtons";
import { MobileMoneyForm } from "./MobileMoneyForm";
import { listPaymentTransactions, findTransactionByReference } from "@/lib/db/payments";
import { TRANSACTION_STATUS_TONES, statusBadgeClass } from "@/lib/status-colors";
import {
  alertWarningClass,
  alertSuccessClass,
  alertErrorClass,
  alertInfoClass,
} from "@/app/components/FormField";
import { getPreferredProvider } from "@/lib/payments/routing";
import { belongsToGarage } from "@/lib/payments/verify";

export default async function AbonnementPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; paiement?: string; ref?: string }>;
}) {
  const { garageId, role } = await requireStaffSession();
  const params = await searchParams;
  const [subscription, mobileMoneyTransactions, garageSettings] = await Promise.all([
    prisma.subscription.findUnique({ where: { garageId } }),
    listPaymentTransactions(garageId),
    prisma.garageSettings.findUnique({ where: { garageId } }),
  ]);
  const plan = subscription?.plan ?? "FREE";
  const stripeReady = isStripeConfigured();
  const preferredProvider = getPreferredProvider(garageSettings?.currency ?? "EUR");

  // Vérification serveur réelle du statut — jamais une confiance aveugle
  // dans le paramètre d'URL de retour (voir lib/payments/payment-service.ts).
  const returnBanner = await buildReturnBanner(garageId, params);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/parametres"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Paramètres
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Abonnement</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Formule actuelle :{" "}
          <span className="font-semibold text-primary">{PLAN_LABELS[plan]}</span>
        </p>
      </div>

      {returnBanner && <p className={returnBanner.className}>{returnBanner.message}</p>}

      <p className="text-xs text-muted-foreground">
        Moyen de paiement recommandé pour votre devise ({garageSettings?.currency ?? "EUR"}) :{" "}
        <span className="font-medium text-foreground">
          {preferredProvider === "PAYDUNYA" ? "Mobile money (PayDunya)" : "Carte bancaire (Stripe)"}
        </span>
        . L&apos;autre moyen reste disponible ci-dessous si besoin.
      </p>

      {!stripeReady && (
        <p className={alertWarningClass}>
          Stripe n&apos;est pas encore configuré (clés placeholder) — la formule Gratuite reste
          pleinement fonctionnelle, mais le passage aux formules payantes nécessite d&apos;ajouter
          de vraies clés API dans les variables d&apos;environnement.
        </p>
      )}

      {role !== "OWNER" && (
        <p className="text-sm text-muted-foreground">
          Seul le propriétaire du garage peut gérer l&apos;abonnement.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(["FREE", "PRO", "PREMIUM"] as const).map((tier) => (
          <div
            key={tier}
            className={`rounded-xl border p-5 ${
              plan === tier ? "border-primary/50 bg-primary/10" : "border-border bg-card"
            }`}
          >
            <p className="font-semibold text-foreground">{PLAN_LABELS[tier]}</p>
            <p className="mt-1 text-lg font-bold text-foreground">{formatPlanPrice(tier)}</p>
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              <li>
                {PLAN_LIMITS[tier].maxClients === Infinity
                  ? "Clients illimités"
                  : `${PLAN_LIMITS[tier].maxClients} clients max`}
              </li>
              <li>
                {PLAN_LIMITS[tier].maxStaffUsers === Infinity
                  ? "Utilisateurs illimités"
                  : `${PLAN_LIMITS[tier].maxStaffUsers} utilisateur(s)`}
              </li>
              <li>{PLAN_LIMITS[tier].clientPortal ? "Portail client" : "Sans portail client"}</li>
              <li>{PLAN_LIMITS[tier].pdfExport ? "Export PDF" : "Sans export PDF"}</li>
            </ul>
            {tier !== "FREE" && plan !== tier && role === "OWNER" && (
              <div className="mt-4">
                <UpgradeButton plan={tier} label={`Passer ${PLAN_LABELS[tier]}`} />
              </div>
            )}
          </div>
        ))}
      </div>

      {subscription?.stripeCustomerId && role === "OWNER" && (
        <ManageBillingButton />
      )}

      {role === "OWNER" && <MobileMoneyForm />}

      {mobileMoneyTransactions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground">Historique des paiements</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Formule</th>
                  <th className="px-4 py-2 font-medium">Moyen</th>
                  <th className="px-4 py-2 font-medium">Montant</th>
                  <th className="px-4 py-2 font-medium">Référence</th>
                  <th className="px-4 py-2 font-medium">Statut</th>
                  <th className="px-4 py-2 font-medium">Reçu</th>
                </tr>
              </thead>
              <tbody>
                {mobileMoneyTransactions.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-muted-foreground">
                      {new Date(t.initiatedAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-2">{t.planTier ?? "—"}</td>
                    <td className="px-4 py-2">{t.channel}</td>
                    <td className="px-4 py-2">
                      {Number(t.amount).toLocaleString("fr-FR")} {t.currency}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground/70">
                      {maskReference(t.reference)}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-4 py-2">
                      {t.status === "SUCCESS" ? (
                        <a
                          href={`/api/payments/${t.id}/receipt`}
                          className="text-primary hover:underline"
                        >
                          Télécharger
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function maskReference(reference: string) {
  return reference.length <= 8 ? reference : `${reference.slice(0, 6)}…${reference.slice(-4)}`;
}

/**
 * Construit le message de retour de paiement en relisant le vrai statut en
 * base — jamais en faisant confiance au seul paramètre d'URL (un paiement
 * n'est jamais considéré réussi simplement parce que l'utilisateur revient
 * sur cette page).
 */
async function buildReturnBanner(
  garageId: string,
  params: { checkout?: string; paiement?: string; ref?: string }
): Promise<{ message: string; className: string } | null> {
  // Retour PayDunya avec référence : on peut vérifier la transaction précise.
  if (params.ref) {
    const transaction = await findTransactionByReference(params.ref);
    // Défense en profondeur : une référence appartenant à un autre garage
    // ne doit jamais révéler son statut ici, même si elle est pratiquement
    // impossible à deviner (UUID).
    if (belongsToGarage(transaction, garageId)) {
      switch (transaction.status) {
        case "SUCCESS":
          return {
            message: "Paiement confirmé. Votre abonnement Garage Pro est maintenant actif.",
            className: alertSuccessClass,
          };
        case "FAILED":
          return { message: "Le paiement n'a pas pu être finalisé.", className: alertErrorClass };
        case "CANCELLED":
        case "EXPIRED":
          return { message: "Le paiement n'a pas été finalisé.", className: alertWarningClass };
        default:
          return {
            message: "Votre paiement est en cours de confirmation.",
            className: alertInfoClass,
          };
      }
    }
  }

  if (params.paiement === "annule") {
    return { message: "Le paiement n'a pas été finalisé.", className: alertWarningClass };
  }

  // Retour Stripe : pas de référence dans l'URL — on relit l'abonnement
  // fraîchement chargé en haut de la page (déjà une lecture serveur réelle).
  if (params.checkout === "success") {
    const subscription = await prisma.subscription.findUnique({ where: { garageId } });
    if (subscription && subscription.plan !== "FREE" && subscription.status === "ACTIVE") {
      return {
        message: "Paiement confirmé. Votre abonnement Garage Pro est maintenant actif.",
        className: alertSuccessClass,
      };
    }
    return {
      message: "Votre paiement est en cours de confirmation. Rechargez cette page dans un instant.",
      className: alertInfoClass,
    };
  }

  if (params.checkout === "cancelled") {
    return { message: "Le paiement n'a pas été finalisé.", className: alertWarningClass };
  }

  return null;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PROCESSING: "En cours",
  SUCCESS: "Réussi",
  FAILED: "Échoué",
  CANCELLED: "Annulé",
  EXPIRED: "Expiré",
  REFUNDED: "Remboursé",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={statusBadgeClass(TRANSACTION_STATUS_TONES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}
