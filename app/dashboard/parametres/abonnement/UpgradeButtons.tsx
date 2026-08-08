"use client";

import { useState } from "react";

export function UpgradeButton({ plan, label }: { plan: "PRO" | "PREMIUM"; label: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error || "Erreur");
      setPending(false);
      return;
    }
    window.location.href = body.url;
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={pending}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {pending ? "..." : label}
      </button>
      {error && <p className="mt-2 text-xs text-danger-foreground">{error}</p>}
    </div>
  );
}

export function ManageBillingButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error || "Erreur");
      setPending(false);
      return;
    }
    window.location.href = body.url;
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={pending}
        className="rounded-md border border-input bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-background disabled:opacity-60"
      >
        {pending ? "..." : "Gérer ma facturation"}
      </button>
      {error && <p className="mt-2 text-xs text-danger-foreground">{error}</p>}
    </div>
  );
}
