import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { scopedPrisma } from "@/lib/prisma";
import { storage } from "@/lib/storage/local-fs-adapter";
import { assertWithinLimit, PlanLimitExceededError } from "@/lib/plan-guard";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.accountType !== "STAFF") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id: repairOrderId } = await params;
  const garageId = session.user.garageId;
  const db = scopedPrisma(garageId);

  const order = await db.repairOrder.findFirst({ where: { id: repairOrderId } });
  if (!order) {
    return NextResponse.json({ error: "Réparation introuvable" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté (jpg, png, webp uniquement)" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "Fichier trop volumineux (max 8 Mo)" }, { status: 400 });
  }

  const existingPhotoCount = await db.repairPhoto.count({ where: { repairOrderId } });
  try {
    await assertWithinLimit(garageId, "maxPhotosPerRepair", existingPhotoCount);
  } catch (err) {
    if (err instanceof PlanLimitExceededError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `${garageId}/${repairOrderId}/${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await storage.save(buffer, key);

  const photo = await db.repairPhoto.create({
    data: { garageId, repairOrderId, filePath: key },
  });

  return NextResponse.json(photo, { status: 201 });
}
