/**
 * Source unique pour les constantes et la liste des pages "Informations" —
 * réutilisée par le footer, le hub Paramètres, et les renvois internes
 * entre pages (FAQ ↔ Guide ↔ Contact).
 */

// Doit rester synchronisé avec la version dans package.json.
export const APP_VERSION = "0.1.0";

export const SUPPORT_EMAIL = "madiaayelee@gmail.com";

export type InfoPage = {
  href: string;
  label: string;
  icon: string;
};

export const INFO_PAGES: InfoPage[] = [
  { href: "/a-propos", label: "À propos de Garage Pro", icon: "🏢" },
  { href: "/pourquoi-garage-pro", label: "Pourquoi Garage Pro ?", icon: "🎯" },
  { href: "/guide", label: "Comment utiliser Garage Pro ?", icon: "📱" },
  { href: "/confidentialite", label: "Politique de confidentialité", icon: "🔐" },
  { href: "/conditions", label: "Conditions d'utilisation", icon: "📜" },
  { href: "/tarifs", label: "Tarifs, paiements et abonnements", icon: "💳" },
  { href: "/contact", label: "Contact", icon: "📞" },
  { href: "/faq", label: "Questions fréquentes", icon: "❓" },
];
