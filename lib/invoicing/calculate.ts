import { Prisma } from "@/app/generated/prisma/client";

const { Decimal } = Prisma;

export type CalcLineItem = {
  quantity: number;
  unitPrice: Prisma.Decimal | number | string;
};

export type DocumentTotals = {
  laborCost: Prisma.Decimal;
  partsCost: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  taxAmount: Prisma.Decimal;
  total: Prisma.Decimal;
};

/**
 * Calcul serveur uniquement — jamais confiance dans un total envoyé par le
 * client. Utilise Decimal (jamais number/float) pour éviter les erreurs
 * d'arrondi sur des montants d'argent.
 */
export function calculateDocumentTotals(params: {
  laborHours: Prisma.Decimal | number | string;
  hourlyRate: Prisma.Decimal | number | string;
  taxRatePercent: Prisma.Decimal | number | string;
  lineItems: CalcLineItem[];
}): DocumentTotals {
  const laborCost = new Decimal(params.laborHours).mul(new Decimal(params.hourlyRate));

  const partsCost = params.lineItems.reduce(
    (sum, li) => sum.add(new Decimal(li.unitPrice).mul(li.quantity)),
    new Decimal(0)
  );

  const subtotal = laborCost.add(partsCost);
  const taxAmount = subtotal.mul(new Decimal(params.taxRatePercent)).div(100);
  const total = subtotal.add(taxAmount);

  return {
    laborCost: laborCost.toDecimalPlaces(2),
    partsCost: partsCost.toDecimalPlaces(2),
    subtotal: subtotal.toDecimalPlaces(2),
    taxAmount: taxAmount.toDecimalPlaces(2),
    total: total.toDecimalPlaces(2),
  };
}

export function lineTotal(quantity: number, unitPrice: Prisma.Decimal | number | string) {
  return new Decimal(unitPrice).mul(quantity).toDecimalPlaces(2);
}
