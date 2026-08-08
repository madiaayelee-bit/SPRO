import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Tables métier portant un `garageId` — toute lecture/écriture doit passer
 * par la couche `lib/db/*` qui utilise `scopedPrisma(garageId)`, jamais `prisma` directement.
 */
const TENANT_MODELS = [
  "user",
  "client",
  "vehicle",
  "repairOrder",
  "repairPhoto",
  "inventoryItem",
  "quote",
  "invoice",
  "inviteToken",
  "paymentTransaction",
] as const;

// `QuoteLineItem`, `InvoiceLineItem` et `RepairPartUsage` n'ont pas de colonne
// `garageId` (ils héritent du tenant de leur parent) — ils ne peuvent donc pas
// être scopés ici. La couche `lib/db/*` DOIT toujours les atteindre via une
// requête sur leur parent (`quote.findFirst({ where: { id, garageId } })`),
// jamais via une requête directe sur ces modèles.

type TenantModel = (typeof TENANT_MODELS)[number];

/**
 * Renvoie un client Prisma qui injecte automatiquement `where: { garageId }`
 * sur les modèles tenant, et rejette toute requête qui tenterait de filtrer
 * sur un `garageId` différent — défense en profondeur contre une fuite
 * cross-tenant même si un appelant oublie de filtrer manuellement.
 */
export function scopedPrisma(garageId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const modelName = (model.charAt(0).toLowerCase() + model.slice(1)) as TenantModel;
          if (!TENANT_MODELS.includes(modelName)) {
            return query(args);
          }

          const a = args as Record<string, unknown>;

          if (
            operation === "create" ||
            operation === "createMany" ||
            operation === "createManyAndReturn"
          ) {
            const injectGarageId = (data: Record<string, unknown>) => {
              if ("garageId" in data && data.garageId !== garageId) {
                throw new Error(
                  `Tentative de création cross-tenant refusée sur ${model}`
                );
              }
              data.garageId = garageId;
            };
            if (Array.isArray(a.data)) {
              a.data.forEach((d) => injectGarageId(d as Record<string, unknown>));
            } else if (a.data && typeof a.data === "object") {
              injectGarageId(a.data as Record<string, unknown>);
            }
            return query(a);
          }

          const where = (a.where ?? {}) as Record<string, unknown>;
          if ("garageId" in where && where.garageId !== garageId) {
            throw new Error(`Tentative d'accès cross-tenant refusée sur ${model}`);
          }
          a.where = { ...where, garageId };
          return query(a);
        },
      },
    },
  });
}

export type ScopedPrisma = ReturnType<typeof scopedPrisma>;
