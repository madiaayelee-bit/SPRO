export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-xs text-danger-foreground">{errors[0]}</p>;
}

export const inputClass =
  "mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";

export const labelClass = "block text-sm font-medium text-foreground";

export const alertSuccessClass =
  "rounded-md border border-success/30 bg-success px-3 py-2 text-sm text-success-foreground";
export const alertErrorClass =
  "rounded-md border border-danger/30 bg-danger px-3 py-2 text-sm text-danger-foreground";
export const alertWarningClass =
  "rounded-md border border-warning/30 bg-warning px-3 py-2 text-sm text-warning-foreground";
export const alertInfoClass =
  "rounded-md border border-info/30 bg-info px-3 py-2 text-sm text-info-foreground";
