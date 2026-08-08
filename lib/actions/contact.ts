"use server";

import { contactMessageSchema } from "@/lib/validations/contact";
import { createContactMessage } from "@/lib/db/contact";

export type ContactFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: boolean;
};

/**
 * Enregistre le message en base — aucun service d'envoi d'e-mail n'est
 * configuré à ce jour, donc rien n'est "expédié" automatiquement. Voir
 * lib/db/contact.ts.
 */
export async function submitContactMessageAction(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = contactMessageSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    category: formData.get("category"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createContactMessage(parsed.data);
  } catch {
    return { error: "Une erreur est survenue lors de l'envoi. Réessayez dans quelques instants." };
  }

  return { success: true };
}
