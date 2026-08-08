import { NextResponse } from "next/server";
import { processProviderWebhook } from "@/lib/payments/payment-service";

/**
 * Un endpoint par prestataire (ex: /api/payments/mobile-money/webhook/paydunya)
 * — c'est l'URL à déclarer dans le tableau de bord du prestataire une fois
 * un compte réel configuré. Tant qu'aucun adaptateur réel n'est branché,
 * cette route répond 503 : aucune confirmation de paiement n'est jamais
 * fabriquée ici.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const rawBody = await request.text();

  const result = await processProviderWebhook(provider, rawBody, request.headers);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.httpStatus });
  }
  return NextResponse.json({ received: true });
}
