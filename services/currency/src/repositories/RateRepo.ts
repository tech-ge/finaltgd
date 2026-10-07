import type { Pool } from 'pg';

export interface RateRow {
  rate_id: number;
  fiat_currency_code: string;
  fiat_per_one_tgd: string;
  is_active: boolean;
  last_updated: Date;
}

export class RateRepo {
  constructor(private readonly pool: Pool) {}

  async listActive(): Promise<RateRow[]> {
    const { rows } = await this.pool.query<RateRow>(
      'SELECT * FROM currency_rates WHERE is_active = TRUE ORDER BY fiat_currency_code',
    );
    return rows;
  }

  async upsert(code: string, rate: string): Promise<RateRow> {
    const { rows } = await this.pool.query<RateRow>(
      `INSERT INTO currency_rates (fiat_currency_code, fiat_per_one_tgd, is_active, last_updated)
       VALUES ($1, $2, TRUE, CURRENT_TIMESTAMP)
       ON CONFLICT (fiat_currency_code) DO UPDATE
         SET fiat_per_one_tgd = EXCLUDED.fiat_per_one_tgd,
             last_updated = CURRENT_TIMESTAMP
       RETURNING *`,
      [code.toUpperCase(), rate],
    );
    const row = rows[0];
    if (!row) {
      throw new Error('rate_upsert_failed');
    }
    return row;
  }
}
