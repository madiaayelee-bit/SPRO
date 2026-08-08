export type NavItem = {
  label: string;
  href: string;
};

export const DASHBOARD_NAV: NavItem[] = [
  { label: "Tableau de bord", href: "/dashboard" },
  { label: "Clients", href: "/dashboard/clients" },
  { label: "Réparations", href: "/dashboard/reparations" },
  { label: "Stock", href: "/dashboard/stock" },
  { label: "Devis", href: "/dashboard/devis" },
  { label: "Factures", href: "/dashboard/factures" },
  { label: "Paramètres", href: "/dashboard/parametres" },
];

export const PORTAL_NAV: NavItem[] = [
  { label: "Mes véhicules", href: "/portail" },
  { label: "Mes devis", href: "/portail/devis" },
  { label: "Mes factures", href: "/portail/factures" },
];
