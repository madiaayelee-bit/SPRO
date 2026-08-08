import { z } from "zod";

export const registerGarageSchema = z.object({
  garageName: z.string().trim().min(2, "Le nom du garage est trop court"),
  garagePhone: z.string().trim().optional(),
  ownerFirstName: z.string().trim().min(1, "Prénom requis"),
  ownerLastName: z.string().trim().min(1, "Nom requis"),
  ownerEmail: z.string().trim().toLowerCase().email("Email invalide"),
  ownerPassword: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type RegisterGarageInput = z.infer<typeof registerGarageSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginInput = z.infer<typeof loginSchema>;
