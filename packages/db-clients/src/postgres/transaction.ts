import type { PoolClient } from 'pg';

export type IsolationLevel =
  | 'READ COMMITTED'
  | 'REPEATABLE READ'
  | 'SERIALIZABLE';

export interface TransactionOptions {
  isolation?: IsolationLevel;
  readOnly?: boolean;
  deferrable?: boolean;
}

export async function beginTransaction(
  client: PoolClient,
  options: TransactionOptions = {},
): Promise<void> {
  const parts: string[] = ['BEGIN'];
  if (options.isolation) {
    parts.push(`ISOLATION LEVEL ${options.isolation}`);
  }
  if (options.readOnly) {
    parts.push('READ ONLY');
  }
  if (options.deferrable) {
    parts.push('DEFERRABLE');
  }
  await client.query(parts.join(' '));
}

export async function commit(client: PoolClient): Promise<void> {
  await client.query('COMMIT');
}

export async function rollback(client: PoolClient): Promise<void> {
  await client.query('ROLLBACK');
}

export async function withSerializable<T>(
  client: PoolClient,
  fn: () => Promise<T>,
): Promise<T> {
  await beginTransaction(client, { isolation: 'SERIALIZABLE' });
  try {
    const result = await fn();
    await commit(client);
    return result;
  } catch (err) {
    await rollback(client);
    throw err;
  }
}

export async function withReadOnly<T>(
  client: PoolClient,
  fn: () => Promise<T>,
): Promise<T> {
  await beginTransaction(client, { readOnly: true });
  try {
    const result = await fn();
    await commit(client);
    return result;
  } catch (err) {
    await rollback(client);
    throw err;
  }
}
