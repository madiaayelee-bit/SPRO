/**
 * Système de classes partagé pour toute la navigation par onglets de
 * l'application — garantit que les onglets principaux (niveau 1) et les
 * sous-onglets (niveau 2) restent cohérents entre toutes les surfaces
 * (sidebar desktop, nav mobile, portail, filtres) sans forcer un composant
 * JSX unique sur des formes visuelles différentes.
 */

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Onglet principal — sidebar verticale desktop. */
export function sidebarNavLinkClass(active: boolean) {
  return [
    "flex min-h-11 items-center rounded-md border-l-2 px-3 py-2.5 text-sm transition-colors",
    FOCUS_RING,
    active
      ? "border-primary bg-primary/10 font-semibold text-foreground"
      : "border-transparent font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
  ].join(" ");
}

/** Onglet principal — nav horizontale (mobile dashboard, portail). */
export function horizontalNavLinkClass(active: boolean) {
  return [
    "flex min-h-11 shrink-0 items-center border-b-2 px-3 text-sm transition-colors",
    FOCUS_RING,
    active
      ? "border-primary font-semibold text-foreground"
      : "border-transparent font-medium text-muted-foreground hover:text-foreground",
  ].join(" ");
}

/** Sous-onglet — pastille de filtre (ex: statut de réparation). Volontairement
 * plus discret que le niveau 1 par sa forme (pastille compacte), pas par une
 * police plus petite. */
export function subNavPillClass(active: boolean) {
  return [
    "flex min-h-9 shrink-0 items-center rounded-full px-3.5 text-sm transition-colors",
    FOCUS_RING,
    active
      ? "bg-foreground font-semibold text-background"
      : "bg-muted font-medium text-muted-foreground hover:bg-border hover:text-foreground",
  ].join(" ");
}
