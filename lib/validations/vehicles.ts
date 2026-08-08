import { z } from "zod";

const optionalInt = (min: number, max?: number) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    max !== undefined
      ? z.coerce.number().int().min(min).max(max).optional()
      : z.coerce.number().int().min(min).optional()
  );

export const vehicleSchema = z.object({
  type: z.enum(["CAR", "MOTORCYCLE"]),
  make: z.string().trim().min(1, "Marque requise"),
  model: z.string().trim().min(1, "Modèle requis"),
  plateNumber: z.string().trim().min(1, "Plaque requise"),
  vin: z.string().trim().optional(),
  year: optionalInt(1900, 2100),
  mileage: optionalInt(0),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
