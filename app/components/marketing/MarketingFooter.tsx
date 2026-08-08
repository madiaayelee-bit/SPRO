import Link from "next/link";
import { Wordmark } from "./Logo";
import { INFO_PAGES } from "@/lib/site-info";

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Wordmark className="h-10 w-10" />
              <span className="font-display text-lg font-semibold tracking-tight text-ink">
                Garage Pro
              </span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-ink/60">
              Le logiciel de gestion pour garages automobiles et moto modernes.
            </p>
          </div>
          <nav
            aria-label="Informations"
            className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-ink/60 sm:grid-cols-2"
          >
            {INFO_PAGES.map((page) => (
              <Link key={page.href} href={page.href} className="hover:text-ink">
                {page.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-6 text-sm text-ink/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Garage Pro</p>
          <div className="flex gap-6">
            <Link href="/connexion" className="hover:text-ink">
              Connexion
            </Link>
            <Link href="/inscription" className="hover:text-ink">
              Inscription
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
