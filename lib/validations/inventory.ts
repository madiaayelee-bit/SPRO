import { z } from "zod";

export const inventoryItemSchema = z.object({
  name: z.string().trim().min(1, "Nom requis"),
  reference: z.string().trim().optional(),
  unitPrice: z.coerce.number().min(0, "Prix invalide"),
  quantityInStock: z.coerce.number().int().min(0, "Quantité invalide"),
  lowStockThreshold: z.coerce.number().int().min(0).default(3),
});

export type InventoryItemInput = z.infer<typeof inventoryItemSchema>;
