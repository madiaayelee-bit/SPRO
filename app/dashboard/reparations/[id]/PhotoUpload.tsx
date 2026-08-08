"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function PhotoUpload({ repairOrderId }: { repairOrderId: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/repair-orders/${repairOrderId}/photos`, {
      method: "POST",
      body: formData,
    });

    setPending(false);
    if (inputRef.current) inputRef.current.value = "";

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Échec de l'envoi de la photo");
      return;
    }

    router.refresh();
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center rounded-md border border-input bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-background">
        {pending ? "Envoi..." : "+ Ajouter une photo"}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          disabled={pending}
          className="hidden"
        />
      </label>
      {error && <p className="mt-1 text-xs text-danger-foreground">{error}</p>}
    </div>
  );
}
