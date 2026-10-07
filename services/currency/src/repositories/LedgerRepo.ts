import type { Pool } from 'pg';

export interface LedgerTransferRow {
  transfer_id: number;
  operation: string;
  from_account: number | null;
  to_account: number;
  amount: string;
  reference: string;
  idempotency_key: string;
  created_at: Date;
}

export class LedgerRepo {
  constructor(private readonly pool: Pool) {}

  async findByIdempotencyKey(key: string): Promise<LedgerTransferRow | null> {
    const { rows } = await this.pool.query<LedgerTransferRow>(
      'SELECT * FROM ledger_transfers WHERE idempotency_key = $1 LIMIT 1',
      [key],
    );
    return rows[0] ?? null;
  }

  async listForAccount(accountId: number, limit = 100): Promise<LedgerTransferRow[]> {
    const { rows } = await this.pool.query<LedgerTransferRow>(
      `SELECT * FROM ledger_transfers
       WHERE from_account = $1 OR to_account = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [accountId, limit],
    );
    return rows;
  }
}
