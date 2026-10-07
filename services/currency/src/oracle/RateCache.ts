import type { Redis } from 'ioredis';

const TTL_SECONDS = 60;

export class RateCache {
  constructor(private readonly redis: Redis) {}

  private key(fiat: string): string {
    return `rate:${fiat.toUpperCase()}`;
  }

  async get(fiat: string): Promise<string | null> {
    return this.redis.get(this.key(fiat));
  }

  async set(fiat: string, value: string): Promise<void> {
    await this.redis.set(this.key(fiat), value, 'EX', TTL_SECONDS);
  }

  async invalidate(fiat: string): Promise<void> {
    await this.redis.del(this.key(fiat));
  }
}
