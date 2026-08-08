import { z } from "zod";

export const PAYMENT_CHANNELS = [
  "ORANGE_MONEY",
  "MTN_MOMO",
  "MOOV_MONEY",
  "WAVE",
  "FREE_MONEY",
  "AIRTEL_MONEY",
  "MPESA",
] as const;

export const mobileMoneyPaymentSchema = z.object({
  countryCode: z.string().length(2, "Pays requis"),
  channel: z.enum(PAYMENT_CHANNELS),
  phoneNumber: z
    .string()
    .trim()
    .min(6, "Numéro de téléphone invalide")
    .max(20, "Numéro de téléphone invalide"),
  plan: z.enum(["PRO", "PREMIUM"]),
});

export type MobileMoneyPaymentInput = z.infer<typeof mobileMoneyPaymentSchema>;

export const stripeCheckoutSchema = z.object({
  plan: z.enum(["PRO", "PREMIUM"]),
});

export type StripeCheckoutInput = z.infer<typeof stripeCheckoutSchema>;
