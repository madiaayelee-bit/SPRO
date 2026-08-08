"use client";

import { useActionState } from "react";
import { submitContactMessageAction, type ContactFormState } from "@/lib/actions/contact";
import { CONTACT_CATEGORIES, CONTACT_CATEGORY_LABELS } from "@/lib/validations/contact";
import { inputClass, labelClass, FieldError, alertSuccessClass, alertErrorClass } from "@/app/components/FormField";

const initialState: ContactFormState = {};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessageAction, initialState);

  if (state.success) {
    return (
      <div className={`${alertSuccessClass} p-6`}>
        Votre message a bien été envoyé. Notre équipe vous répondra dès que possible.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <p className={alertErrorClass}>{state.error}</p>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Nom
          </label>
          <input id="name" name="name" required className={inputClass} />
          <FieldError errors={state.fieldErrors?.name} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input id="email" name="email" type="email" required className={inputClass} />
          <FieldError errors={state.fieldErrors?.email} />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className={labelClass}>
          Téléphone (optionnel)
        </label>
        <input id="phone" name="phone" className={inputClass} />
      </div>
      <div>
        <label htmlFor="category" className={labelClass}>
          Catégorie
        </label>
        <select id="category" name="category" required defaultValue="OTHER" className={inputClass}>
          {CONTACT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CONTACT_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea id="message" name="message" required rows={5} className={inputClass} />
        <FieldError errors={state.fieldErrors?.message} />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
