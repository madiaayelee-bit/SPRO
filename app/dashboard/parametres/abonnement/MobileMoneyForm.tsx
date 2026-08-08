"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  initiateMobileMoneyPaymentAction,
  type PaymentActionState,
} from "@/lib/actions/payments";
import { SUPPORTED_COUNTRIES, CHANNEL_LABELS } from "@/lib/payments/countries";
import { getPlanPrice } from "@/lib/payments/pricing";
import { inputClass, labelClass } from "@/app/components/FormField";

export function MobileMoneyForm() {
  const [state, formAction, pending] = useActionState<PaymentActionState, FormData>(
    initiateMobileMoneyPaymentAction,
    {}
  );
  const [countryCode, setCountryCode] = useState(SUPPORTED_COUNTRIES[0].code);
  const [plan, setPlan] = useState<"PRO" | "PREMIUM">("PRO");

  const country = useMemo(
    () => SUPPORTED_COUNTRIES.find((c) => c.code === countryCode)!,
    [countryCode]
  );

  // Affichage indicatif uniquement : lit la même table de référence que le
  // serveur (lib/payments/pricing.ts), ne recalcule/convertit rien — le
  // montant réellement facturé est revérifié côté serveur à la soumission.
  const price = getPlanPrice(country.currency, plan);

  // Le prestataire (ex: PayDunya) exige une redirection vers sa page de
  // paiement hébergée — jamais de "succès" affiché avant confirmation
  // serveur réelle via le webhook, une fois le client revenu ici.
  useEffect(() => {
    if (state.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state.redirectUrl]);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-semibold text-foreground">Paiement mobile money (Afrique)</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Orange Money, Wave, Free Money via PayDunya. Autres opérateurs à venir.
      </p>

      <form action={formAction} className="mt-4 max-w-md space-y-4">
        <div>
          <label htmlFor="plan" className={labelClass}>
            Formule
          </label>
          <select
            id="plan"
            name="plan"
            required
            value={plan}
            onChange={(e) => setPlan(e.target.value as "PRO" | "PREMIUM")}
            className={inputClass}
          >
            <option value="PRO">Pro</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>

        <div>
          <label htmlFor="countryCode" className={labelClass}>
            Pays
          </label>
          <select
            id="countryCode"
            name="countryCode"
            required
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className={inputClass}
          >
            {SUPPORTED_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.currency})
              </option>
            ))}
          </select>
          {country.paydunyaConfidence === "unverified" && (
            <p className="mt-1 text-xs text-warning-foreground">
              Couverture PayDunya non confirmée pour ce pays — à vérifier dans votre dashboard
              PayDunya avant mise en production.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="channel" className={labelClass}>
            Moyen de paiement
          </label>
          <select id="channel" name="channel" required className={inputClass}>
            {country.channels.map((channel) => (
              <option key={channel} value={channel}>
                {CHANNEL_LABELS[channel]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="phoneNumber" className={labelClass}>
            Numéro de téléphone mobile money
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            required
            placeholder="Ex : 77 123 45 67"
            className={inputClass}
          />
        </div>

        <div
          className={`rounded-md px-3 py-2 text-sm font-medium ${
            price === null ? "bg-muted text-muted-foreground" : "bg-foreground text-background"
          }`}
        >
          {price === null
            ? `Tarif à configurer pour cette devise (${country.currency})`
            : `Montant à payer : ${price.toLocaleString("fr-FR")} ${country.currency} / mois`}
        </div>

        {state.error && (
          <p className="rounded-md border border-warning/30 bg-warning px-3 py-2 text-sm text-warning-foreground">{state.error}</p>
        )}
        {state.redirectUrl && (
          <p className="rounded-md border border-success/30 bg-success px-3 py-2 text-sm text-success-foreground">
            Redirection vers la page de paiement…
          </p>
        )}

        <button
          type="submit"
          disabled={pending || price === null}
          className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background hover:bg-foreground/90 disabled:opacity-60"
        >
          {pending ? "..." : "Payer avec mobile money"}
        </button>
      </form>
    </div>
  );
}
