"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

type Mode = "light" | "dark" | "system";

const MODES: { value: Mode; label: string; icon: string; description: string }[] = [
  { value: "light", label: "Jour", icon: "☀️", description: "Toujours le thème clair" },
  { value: "dark", label: "Nuit", icon: "🌙", description: "Toujours le thème sombre" },
  { value: "system", label: "Automatique", icon: "🌓", description: "Suit le réglage de votre appareil" },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ModeIcon({ mode }: { mode: Mode }) {
  if (mode === "light") return <SunIcon />;
  if (mode === "dark") return <MoonIcon />;
  return <SystemIcon />;
}

function nextMode(mode: Mode): Mode {
  if (mode === "light") return "dark";
  if (mode === "dark") return "system";
  return "light";
}

export function ThemeToggle({
  variant = "icon",
  className = "",
}: {
  variant?: "icon" | "full";
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const current = (mounted ? (theme as Mode) : undefined) ?? "system";

  if (variant === "full") {
    return (
      <div className={`grid grid-cols-1 gap-3 sm:grid-cols-3 ${className}`}>
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            aria-pressed={mounted && current === m.value}
            onClick={() => setTheme(m.value)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              mounted && current === m.value
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            <p className="text-sm font-semibold text-foreground">
              {m.icon} {m.label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
          </button>
        ))}
      </div>
    );
  }

  const next = nextMode(current);
  const nextLabel = MODES.find((m) => m.value === next)?.label ?? "";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={mounted ? `Thème actuel : ${MODES.find((m) => m.value === current)?.label}. Passer en mode ${nextLabel}.` : "Changer de thème"}
      title={mounted ? `Thème : ${MODES.find((m) => m.value === current)?.label}` : undefined}
      className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${className}`}
    >
      {mounted ? <ModeIcon mode={current} /> : <span className="h-[18px] w-[18px]" />}
    </button>
  );
}
