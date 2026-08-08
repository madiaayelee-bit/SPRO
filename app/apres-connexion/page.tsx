import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ApresConnexionPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion");
  }

  if (session.user.accountType === "CLIENT") {
    redirect("/portail");
  }

  redirect("/dashboard");
}
