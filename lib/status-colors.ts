export type StatusTone = "neutral" | "info" | "warning" | "danger" | "success" | "strong" | "faded";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info text-info-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  success: "bg-success text-success-foreground",
  strong: "bg-foreground text-background",
  faded: "bg-muted text-muted-foreground/70 line-through",
};

export function statusBadgeClass(tone: StatusTone) {
  return `inline-block rounded-full px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`;
}

export const REPAIR_STATUS_TONES: Record<string, StatusTone> = {
  RECEIVED: "neutral",
  DIAGNOSED: "info",
  IN_PROGRESS: "warning",
  WAITING_PARTS: "danger",
  READY: "success",
  COMPLETED: "strong",
  CANCELLED: "faded",
};

export const QUOTE_STATUS_TONES: Record<string, StatusTone> = {
  DRAFT: "neutral",
  SENT: "info",
  ACCEPTED: "success",
  REFUSED: "danger",
  CANCELLED: "faded",
};

export const INVOICE_STATUS_TONES: Record<string, StatusTone> = {
  DRAFT: "neutral",
  SENT: "info",
  PAID: "success",
  OVERDUE: "danger",
  CANCELLED: "faded",
};

export const TRANSACTION_STATUS_TONES: Record<string, StatusTone> = {
  PENDING: "neutral",
  PROCESSING: "info",
  SUCCESS: "success",
  FAILED: "danger",
  CANCELLED: "faded",
  EXPIRED: "faded",
  REFUNDED: "warning",
};
