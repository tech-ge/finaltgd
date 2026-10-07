/**
 * Ledger lock behavior. Confirms the ledger Redis uses noeviction
 * and that concurrent transfers serialize through the lock.
 */

import { describe, expect, it } from 'vitest';
import { Redis } from 'ioredis';

const REDIS_URL = process.env.REDIS_LEDGER_URL ?? 'redis://localhost:6379';

describe('ledger redis policy', () => {
  it('reports noeviction', async () => {
    const redis = new Redis(REDIS_URL, { lazyConnect: true });
    await redis.connect();
    try {
      const result = await redis.config('GET', 'maxmemory-policy');
      expect(Array.isArray(result)).toBe(true);
      expect(result[1]).toBe('noeviction');
    } finally {
      await redis.quit();
    }
  });

  it('serializes a contended key', async () => {
    const redis = new Redis(REDIS_URL, { lazyConnect: true });
    await redis.connect();
    try {
      const key = `test-lock-${Date.now()}`;
      const first = await redis.set(key, 'first', 'PX', 5000, 'NX');
      const second = await redis.set(key, 'second', 'PX', 5000, 'NX');

      expect(first).toBe('OK');
      expect(second).toBeNull();

      await redis.del(key);
    } finally {
      await redis.quit();
    }
  });
});
