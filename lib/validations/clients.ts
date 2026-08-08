import { z } from "zod";

export const clientSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis"),
  lastName: z.string().trim().min(1, "Nom requis"),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.union([z.literal(""), z.string().trim().email("Email invalide")]).optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;
