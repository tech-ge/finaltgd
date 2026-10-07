import type { Env } from './index.js';

export async function checkRateLimit(
  env: Env,
  key: string,
  windowSeconds: number,
  maxRequests: number,
): Promise<boolean> {
  if (!env.TECHGEO_KV) {
    return true;
  }

  const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
  const kvKey = `rl:${key}:${bucket}`;

  const currentRaw = await env.TECHGEO_KV.get(kvKey);
  const current = currentRaw ? Number.parseInt(currentRaw, 10) : 0;

  if (Number.isFinite(current) && current >= maxRequests) {
    return false;
  }

  const next = Number.isFinite(current) ? current + 1 : 1;

  await env.TECHGEO_KV.put(kvKey, String(next), {
    expirationTtl: windowSeconds * 2,
  });

  return true;
}
