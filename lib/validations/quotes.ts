import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string().trim().min(1, "Description requise"),
  quantity: z.coerce.number().int().min(1),
  unitPrice: z.coerce.number().min(0),
  inventoryItemId: z.string().optional(),
});

export type LineItemInput = z.infer<typeof lineItemSchema>;

export const documentSchema = z.object({
  clientId: z.string().min(1, "Client requis"),
  repairOrderId: z.string().optional(),
  laborHours: z.coerce.number().min(0).default(0),
  lineItems: z.array(lineItemSchema).default([]),
});

export type DocumentInput = z.infer<typeof documentSchema>;
