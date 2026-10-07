import type { Pool } from 'pg';

export class DuplicateGuard {
  constructor(private readonly pool: Pool) {}

  async exists(gatewayReference: string): Promise<boolean> {
    const { rows } = await this.pool.query<{ deposit_id: number }>(
      'SELECT deposit_id FROM fiat_deposits WHERE gateway_reference = $1 LIMIT 1',
      [gatewayReference],
    );
    return rows.length > 0;
  }

  async existsByIdempotencyKey(key: string): Promise<boolean> {
    const { rows } = await this.pool.query<{ transfer_id: number }>(
      'SELECT transfer_id FROM ledger_transfers WHERE idempotency_key = $1 LIMIT 1',
      [key],
    );
    return rows.length > 0;
  }
}
