import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { PortalNav } from "./PortalNav";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { Wordmark } from "@/app/components/marketing/Logo";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.accountType !== "CLIENT") {
    redirect("/connexion");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Wordmark className="h-9 w-9" />
          <span className="text-lg font-bold text-foreground">Espace client</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="text-muted-foreground hover:bg-muted hover:text-foreground" />
          <form action={logoutAction}>
            <button className="text-sm text-muted-foreground hover:text-foreground">Déconnexion</button>
          </form>
        </div>
      </header>
      <PortalNav />
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
