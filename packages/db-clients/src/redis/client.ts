import { Redis, type RedisOptions } from 'ioredis';

export interface RedisClientConfig {
  url: string;
  role: 'ledger' | 'cache';
  maxRetriesPerRequest?: number;
  enableReadyCheck?: boolean;
  lazyConnect?: boolean;
}

let ledgerClient: Redis | null = null;
let cacheClient: Redis | null = null;

function buildOptions(config: RedisClientConfig): RedisOptions {
  return {
    maxRetriesPerRequest: config.maxRetriesPerRequest ?? 3,
    enableReadyCheck: config.enableReadyCheck ?? true,
    lazyConnect: config.lazyConnect ?? false,
    connectTimeout: 5_000,
    commandTimeout: 5_000,
    retryStrategy: (times: number) => Math.min(times * 200, 2_000),
  };
}

export function createRedisClient(config: RedisClientConfig): Redis {
  if (config.role === 'ledger') {
    if (ledgerClient) {
      return ledgerClient;
    }
    ledgerClient = new Redis(config.url, buildOptions(config));
    ledgerClient.on('error', (err) => console.error('redis_ledger_error', err.message));
    return ledgerClient;
  }

  if (cacheClient) {
    return cacheClient;
  }
  cacheClient = new Redis(config.url, buildOptions(config));
  cacheClient.on('error', (err) => console.error('redis_cache_error', err.message));
  return cacheClient;
}

export function getLedgerRedis(): Redis {
  if (!ledgerClient) {
    throw new Error('redis_ledger_not_initialized');
  }
  return ledgerClient;
}

export function getCacheRedis(): Redis {
  if (!cacheClient) {
    throw new Error('redis_cache_not_initialized');
  }
  return cacheClient;
}

export async function closeRedisClients(): Promise<void> {
  if (ledgerClient) {
    await ledgerClient.quit();
    ledgerClient = null;
  }
  if (cacheClient) {
    await cacheClient.quit();
    cacheClient = null;
  }
}

export async function assertLedgerPolicy(): Promise<void> {
  const client = getLedgerRedis();
  const result = await client.config('GET', 'maxmemory-policy');
  const value = Array.isArray(result) ? result[1] : null;
  if (value !== 'noeviction') {
    throw new Error(`ledger_redis_must_use_noeviction: observed=${String(value)}`);
  }
}
