import pg from 'pg';

const { Pool } = pg;

export interface PostgresConfig {
  connectionString: string;
  maxConnections?: number;
  idleTimeoutMs?: number;
  connectionTimeoutMs?: number;
  applicationName?: string;
}

let pool: pg.Pool | null = null;

export function createPostgresPool(config: PostgresConfig): pg.Pool {
  if (pool) {
    return pool;
  }
  pool = new Pool({
    connectionString: config.connectionString,
    max: config.maxConnections ?? 20,
    idleTimeoutMillis: config.idleTimeoutMs ?? 30_000,
    connectionTimeoutMillis: config.connectionTimeoutMs ?? 5_000,
    application_name: config.applicationName ?? 'techgeo',
    statement_timeout: 30_000,
    query_timeout: 30_000,
  });

  pool.on('error', (err) => {
    console.error('postgres_pool_error', err.message);
  });

  return pool;
}

export function getPostgresPool(): pg.Pool {
  if (!pool) {
    throw new Error('postgres_pool_not_initialized');
  }
  return pool;
}

export async function closePostgresPool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export type { Pool } from 'pg';
