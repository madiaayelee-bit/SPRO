"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DASHBOARD_NAV } from "@/lib/nav-config";
import { sidebarNavLinkClass, horizontalNavLinkClass } from "@/app/components/nav/nav-styles";

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

export function DashboardSidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 px-3">
      {DASHBOARD_NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          className={sidebarNavLinkClass(isActive(pathname, item.href))}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function DashboardMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 lg:hidden">
      {DASHBOARD_NAV.map((item) => (
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
