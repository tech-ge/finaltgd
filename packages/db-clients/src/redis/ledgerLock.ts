import { randomBytes } from 'node:crypto';
import type { Redis } from 'ioredis';

const RELEASE_SCRIPT = `
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
else
  return 0
end
`;

export interface LockHandle {
  key: string;
  token: string;
  ttlMs: number;
}

export class LedgerLock {
  constructor(private readonly redis: Redis, private readonly defaultTtlMs = 30_000) {}

  async acquire(key: string, ttlMs = this.defaultTtlMs): Promise<LockHandle> {
    const token = randomBytes(16).toString('hex');
    const result = await this.redis.set(key, token, 'PX', ttlMs, 'NX');
    if (result !== 'OK') {
      throw new Error(`lock_acquire_failed: ${key}`);
    }
    return { key, token, ttlMs };
  }

  async release(handle: LockHandle): Promise<void> {
    await this.redis.eval(RELEASE_SCRIPT, 1, handle.key, handle.token);
  }

  async withLock<T>(
    key: string,
    fn: () => Promise<T>,
    ttlMs = this.defaultTtlMs,
  ): Promise<T> {
    const handle = await this.acquire(key, ttlMs);
    try {
      return await fn();
    } finally {
      await this.release(handle);
    }
  }
}
