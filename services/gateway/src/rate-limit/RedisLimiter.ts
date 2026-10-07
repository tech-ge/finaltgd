import type { Redis } from 'ioredis';

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export class RedisLimiter {
  constructor(private readonly redis: Redis) {}

  async check(
    bucket: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<RateLimitDecision> {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - (now % windowSeconds);
    const key = `rate:${bucket}:${windowStart}`;

    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, windowSeconds * 2);
    }

    const allowed = count <= maxRequests;
    return {
      allowed,
      remaining: Math.max(0, maxRequests - count),
      retryAfterSeconds: allowed ? 0 : windowSeconds,
    };
  }
}
