import { z } from "zod";

export const CONTACT_CATEGORIES = [
  "TECHNICAL",
  "ACCOUNT",
  "SUBSCRIPTION",
  "PAYMENT",
  "BILLING",
  "SUGGESTION",
  "OTHER",
] as const;

export const CONTACT_CATEGORY_LABELS: Record<(typeof CONTACT_CATEGORIES)[number], string> = {
  TECHNICAL: "Problème technique",
  ACCOUNT: "Compte",
  SUBSCRIPTION: "Abonnement",
  PAYMENT: "Paiement",
  BILLING: "Facturation",
  SUGGESTION: "Suggestion",
  OTHER: "Autre",
};

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(120),
  email: z.string().trim().toLowerCase().email("Email invalide"),
  phone: z.string().trim().max(30).optional(),
  category: z.enum(CONTACT_CATEGORIES),
  message: z.string().trim().min(10, "Message trop court").max(4000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
