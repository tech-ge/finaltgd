import type { Redis } from 'ioredis';

export interface RateLimitDecision {
  allowed: boolean;
  remaining: number;
}

export class RedisLimiter {
  constructor(private readonly redis: Redis) {}

  async check(
    bucket: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<RateLimitDecision> {
    const key = `rate:${bucket}`;
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - (now % windowSeconds);
    const windowKey = `${key}:${windowStart}`;

    const count = await this.redis.incr(windowKey);
    if (count === 1) {
      await this.redis.expire(windowKey, windowSeconds * 2);
    }

    return {
      allowed: count <= maxRequests,
      remaining: Math.max(0, maxRequests - count),
    };
  }
}
