"use client";

import { useState } from "react";

/**
 * Photo plein cadre du hero. Tant que `/images/hero-mecanicien.jpg` n'existe
 * pas dans `public/`, l'image échoue silencieusement et seul le dégradé de
 * repli (rendu par le parent, derrière) reste visible — aucune icône d'image
 * cassée. Dès que le fichier est ajouté, il s'affiche automatiquement au
 * prochain chargement de page.
 */
export function HeroPhoto() {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/hero-mecanicien.jpg"
      alt="Mécanicien souriant, les bras croisés, dans son garage"
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}
