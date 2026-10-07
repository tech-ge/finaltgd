import type { Pool } from 'pg';

export interface FiatDepositRow {
  deposit_id: number;
  account_id: number;
  fiat_amount: string;
  fiat_currency: string;
  applied_rate: string;
  tgd_credited: string;
  gateway_reference: string;
  gateway_name: string;
  status: string;
  created_at: Date;
}

export class DepositRepo {
  constructor(private readonly pool: Pool) {}

  async findByReference(reference: string): Promise<FiatDepositRow | null> {
    const { rows } = await this.pool.query<FiatDepositRow>(
      'SELECT * FROM fiat_deposits WHERE gateway_reference = $1 LIMIT 1',
      [reference],
    );
    return rows[0] ?? null;
  }

  async listForAccount(accountId: number, limit = 100): Promise<FiatDepositRow[]> {
    const { rows } = await this.pool.query<FiatDepositRow>(
      `SELECT * FROM fiat_deposits
       WHERE account_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [accountId, limit],
    );
    return rows;
  }
}
