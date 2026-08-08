import Link from "next/link";
import { requireStaffSession } from "@/lib/session";
import { INFO_PAGES, APP_VERSION } from "@/lib/site-info";

export default async function InformationsPage() {
  await requireStaffSession();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/dashboard/parametres"
          className="text-sm text-muted-foreground/70 hover:text-muted-foreground"
        >
          ← Paramètres
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-foreground">Informations</h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {INFO_PAGES.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="flex items-center gap-3 border-b border-border px-5 py-4 text-sm font-medium text-foreground last:border-0 hover:bg-muted"
          >
            <span aria-hidden="true">{page.icon}</span>
            {page.label}
          </Link>
        ))}
      </div>

      <p className="text-sm text-muted-foreground/70">ℹ️ Version de l&apos;application : {APP_VERSION}</p>
    </div>
  );
}
