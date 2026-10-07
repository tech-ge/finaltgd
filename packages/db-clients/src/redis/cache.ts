import type { Redis } from 'ioredis';

export class CacheClient {
  constructor(private readonly redis: Redis, private readonly prefix = 'cache') {}

  private key(k: string): string {
    return `${this.prefix}:${k}`;
  }

  async get<T>(k: string): Promise<T | null> {
    const raw = await this.redis.get(this.key(k));
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set<T>(k: string, value: T, ttlSeconds: number): Promise<void> {
    await this.redis.set(this.key(k), JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(k: string): Promise<void> {
    await this.redis.del(this.key(k));
  }

  async increment(k: string, ttlSeconds: number): Promise<number> {
    const key = this.key(k);
    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, ttlSeconds);
    }
    return count;
  }
}
