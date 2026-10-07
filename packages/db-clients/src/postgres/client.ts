import type { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

export interface QueryOptions {
  timeoutMs?: number;
}

export class PostgresClient {
  constructor(private readonly pool: Pool) {}

  async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: unknown[] = [],
    options: QueryOptions = {},
  ): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      if (options.timeoutMs) {
        await client.query(`SET LOCAL statement_timeout = ${options.timeoutMs}`);
      }
      return await client.query<T>(sql, params);
    } finally {
      client.release();
    }
  }

  async withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const { rows } = await this.pool.query<{ ok: number }>('SELECT 1 AS ok');
      return rows[0]?.ok === 1;
    } catch {
      return false;
    }
  }
}
