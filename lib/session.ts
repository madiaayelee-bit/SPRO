import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/app/generated/prisma/client";

export async function requireStaffSession() {
  const session = await auth();
  if (!session?.user || session.user.accountType !== "STAFF") {
    redirect("/connexion");
  }
  return {
    garageId: session.user.garageId,
    userId: session.user.id,
    role: session.user.role as Role,
    name: session.user.name ?? "",
  };
}

export async function requireClientSession() {
  const session = await auth();
  if (!session?.user || session.user.accountType !== "CLIENT") {
    redirect("/connexion");
  }
  return {
    garageId: session.user.garageId,
    clientId: session.user.clientId as string,
    name: session.user.name ?? "",
  };
}
