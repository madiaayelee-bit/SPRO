import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentTransaction } from "@/lib/db/payments";
import { generateReceiptPdf } from "@/lib/payments/receipt";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.accountType !== "STAFF") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { transactionId } = await params;
  const transaction = await getPaymentTransaction(session.user.garageId, transactionId);
  if (!transaction) {
    return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
  }
  if (transaction.status !== "SUCCESS") {
    return NextResponse.json(
      { error: "Aucun reçu disponible — ce paiement n'est pas confirmé." },
      { status: 400 }
    );
  }

  const garage = await prisma.garage.findUnique({
    where: { id: session.user.garageId },
    select: { name: true },
  });
  if (!garage) {
    return NextResponse.json({ error: "Garage introuvable" }, { status: 404 });
  }

  const pdfBuffer = await generateReceiptPdf(transaction, garage);

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="recu-${transaction.reference}.pdf"`,
    },
  });
}
