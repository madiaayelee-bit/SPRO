"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PORTAL_NAV } from "@/lib/nav-config";
import { horizontalNavLinkClass } from "@/app/components/nav/nav-styles";

function isActive(pathname: string, href: string) {
  return href === "/portail" ? pathname === href : pathname.startsWith(href);
}

export function PortalNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 sm:px-6">
      {PORTAL_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          className={horizontalNavLinkClass(isActive(pathname, item.href))}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
