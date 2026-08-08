import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage/local-fs-adapter";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { path: segments } = await params;
  const key = segments.join("/");
  const [ownerGarageId] = segments;

  if (ownerGarageId !== session.user.garageId) {
    // 404 plutôt que 403 pour ne pas confirmer l'existence d'une ressource d'un autre garage.
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  if (session.user.accountType === "CLIENT") {
    const photo = await prisma.repairPhoto.findFirst({
      where: { filePath: key, garageId: session.user.garageId },
      include: { repairOrder: { include: { vehicle: true } } },
    });
    if (!photo || photo.repairOrder.vehicle.clientId !== session.user.clientId) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
  }

  try {
    const buffer = await storage.read(key);
    const ext = key.split(".").pop() ?? "";
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }
}
