import Link from "next/link";
import { Wordmark } from "./Logo";
import { ThemeToggle } from "@/app/components/ThemeToggle";

export function MarketingHeader({ dark = false }: { dark?: boolean }) {
  return (
    <header
      className={`sticky top-0 z-20 border-b backdrop-blur ${
        dark ? "border-white/10 bg-steel/90" : "border-ink/10 bg-paper/90"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Wordmark className="h-10 w-10" />
          <span
            className={`font-display text-lg font-semibold tracking-tight ${
              dark ? "text-paper" : "text-ink"
            }`}
          >
            Garage Pro
          </span>
        </Link>
        <nav
          className={`hidden items-center gap-6 text-sm font-medium sm:flex ${
            dark ? "text-paper/70" : "text-ink/70"
          }`}
        >
          <Link
            href="/#fonctionnalites"
            className="rounded px-1 py-2 hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
          >
            Fonctionnalités
          </Link>
          <Link
            href="/tarifs"
            className="rounded px-1 py-2 hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
          >
            Tarifs
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle
            className={dark ? "text-paper/90 hover:bg-white/10" : "text-ink hover:bg-ink/5"}
          />
          <Link
            href="/connexion"
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              dark ? "text-paper/90 hover:bg-white/10" : "text-ink hover:bg-ink/5"
            }`}
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="rounded-md bg-brass px-3 py-1.5 text-sm font-semibold text-paper hover:brightness-110"
          >
            Créer mon garage
          </Link>
        </div>
      </div>
    </header>
  );
}
