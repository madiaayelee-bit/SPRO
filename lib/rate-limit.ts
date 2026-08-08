/**
 * Rate limiting mémoire simple (fenêtre glissante) pour ralentir le
 * brute-force sur les routes d'authentification. Suffisant pour une seule
 * instance ; en production multi-instance, remplacer par un store partagé
 * (Redis/Upstash) — l'interface `checkRateLimit` resterait identique.
 */

const attempts = new Map<string, number[]>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 10;

export function checkRateLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  const timestamps = (attempts.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_ATTEMPTS) {
    const oldest = timestamps[0];
    attempts.set(key, timestamps);
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - oldest) };
  }

  timestamps.push(now);
  attempts.set(key, timestamps);
  return { allowed: true };
}
