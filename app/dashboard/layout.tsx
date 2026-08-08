import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { DashboardSidebarNav, DashboardMobileNav } from "./DashboardNav";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { Wordmark } from "@/app/components/marketing/Logo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.accountType !== "STAFF") {
    redirect("/connexion");
  }

  return (
    <div className="flex min-h-screen bg-background lg:flex-row">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="flex items-center gap-2 px-5 py-5">
          <Wordmark className="h-10 w-10" />
          <span className="text-lg font-bold text-foreground">Garage Pro</span>
        </div>
        <DashboardSidebarNav />
        <div className="flex items-center justify-between border-t border-border p-3">
          <form action={logoutAction}>
            <button className="rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted">
              Déconnexion
            </button>
          </form>
          <ThemeToggle className="text-muted-foreground hover:bg-muted hover:text-foreground" />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <Wordmark className="h-9 w-9" />
            <span className="text-lg font-bold text-foreground">Garage Pro</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="text-muted-foreground hover:bg-muted hover:text-foreground" />
            <form action={logoutAction}>
              <button className="text-sm text-muted-foreground">Déconnexion</button>
            </form>
          </div>
        </header>

        <DashboardMobileNav />

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
