import { randomBytes, createHash } from "crypto";

export function generateInviteToken() {
  const raw = randomBytes(32).toString("hex");
  const hash = hashInviteToken(raw);
  return { raw, hash };
}

export function hashInviteToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export const INVITE_TTL_HOURS = 72;
