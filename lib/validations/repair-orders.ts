import { z } from "zod";

export const REPAIR_STATUSES = [
  "RECEIVED",
  "DIAGNOSED",
  "IN_PROGRESS",
  "WAITING_PARTS",
  "READY",
  "COMPLETED",
  "CANCELLED",
] as const;

export const REPAIR_STATUS_LABELS: Record<(typeof REPAIR_STATUSES)[number], string> = {
  RECEIVED: "Reçu",
  DIAGNOSED: "Diagnostiqué",
  IN_PROGRESS: "En cours",
  WAITING_PARTS: "Attente pièces",
  READY: "Prêt",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

const optionalInt = (min: number) =>
  z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.coerce.number().int().min(min).optional()
  );

const optionalDate = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? undefined : val),
  z.coerce.date().optional()
);

export const repairOrderSchema = z.object({
  vehicleId: z.string().min(1, "Véhicule requis"),
  title: z.string().trim().min(1, "Titre requis"),
  description: z.string().trim().optional(),
  status: z.enum(REPAIR_STATUSES).default("RECEIVED"),
  appointmentDate: optionalDate,
  estimatedDurationMin: optionalInt(0),
  warrantyMonths: optionalInt(0),
});

export type RepairOrderInput = z.infer<typeof repairOrderSchema>;
