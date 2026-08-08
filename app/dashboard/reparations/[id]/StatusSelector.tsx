"use client";

import { useTransition } from "react";
import { updateRepairStatusAction } from "@/lib/actions/repair-orders";
import { REPAIR_STATUSES, REPAIR_STATUS_LABELS } from "@/lib/validations/repair-orders";

export function StatusSelector({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStatus}
      disabled={pending}
      onChange={(e) => {
        const status = e.target.value;
        startTransition(() => {
          updateRepairStatusAction(id, status);
        });
      }}
      className="rounded-md border border-input px-3 py-2 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
    >
      {REPAIR_STATUSES.map((s) => (
        <option key={s} value={s}>
          {REPAIR_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
