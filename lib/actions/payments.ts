"use server";

import { requireStaffSession } from "@/lib/session";
import { mobileMoneyPaymentSchema } from "@/lib/validations/payments";
import { getCountry, isChannelAvailable } from "@/lib/payments/countries";
import { getPlanPrice } from "@/lib/payments/pricing";
import { initiateMobileMoneyPayment } from "@/lib/payments/payment-service";

export type PaymentActionState = {
  error?: string;
  redirectUrl?: string;
  transactionReference?: string;
};

export async function initiateMobileMoneyPaymentAction(
  _prevState: PaymentActionState,
  formData: FormData
): Promise<PaymentActionState> {
  const { garageId, role } = await requireStaffSession();
  if (role !== "OWNER") {
    return { error: "Seul le propriétaire peut gérer l'abonnement." };
  }

  const parsed = mobileMoneyPaymentSchema.safeParse({
    countryCode: formData.get("countryCode"),
    channel: formData.get("channel"),
    phoneNumber: formData.get("phoneNumber"),
    plan: formData.get("plan"),
  });
  if (!parsed.success) {
    return { error: "Le formulaire contient des informations invalides. Vérifiez les champs et réessayez." };
  }
  const { countryCode, channel, phoneNumber, plan } = parsed.data;

  // Le pays, le canal et le montant sont revérifiés côté serveur — jamais
  // fait confiance à ce que le frontend affichait ou envoyait.
  const country = getCountry(countryCode);
  if (!country) {
    return { error: "Ce pays n'est pas pris en charge." };
  }
  if (!isChannelAvailable(countryCode, channel)) {
    return { error: "Cette méthode de paiement n'est pas disponible dans votre pays." };
  }
  const amount = getPlanPrice(country.currency, plan);
  if (amount === null) {
    return {
      error: `Le tarif de la formule ${plan} n'est pas encore configuré en ${country.currency}. Cette offre n'est pas encore disponible dans cette devise.`,
    };
  }

  try {
    const { transaction, redirectUrl } = await initiateMobileMoneyPayment(garageId, {
      channel,
      countryCode,
      currency: country.currency,
      amount,
      phoneNumber,
      planTier: plan,
    });
    return { redirectUrl, transactionReference: transaction.reference };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Le paiement n'a pas pu être initié." };
  }
}
