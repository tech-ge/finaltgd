import type { Pool } from 'pg';

export interface EscrowRow {
  escrow_id: number;
  reference: string;
  from_account: number;
  to_account: number;
  escrow_account: number;
  amount: string;
  state: string;
  release_latitude: string | null;
  release_longitude: string | null;
  release_radius_m: number | null;
  release_biometric: boolean;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class EscrowRepo {
  constructor(private readonly pool: Pool) {}

  async findByReference(reference: string): Promise<EscrowRow | null> {
    const { rows } = await this.pool.query<EscrowRow>(
      'SELECT * FROM escrow_transactions WHERE reference = $1 LIMIT 1',
      [reference],
    );
    return rows[0] ?? null;
  }

  async findLocked(limit = 100): Promise<EscrowRow[]> {
    const { rows } = await this.pool.query<EscrowRow>(
      `SELECT * FROM escrow_transactions
       WHERE state = 'LOCKED'
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit],
    );
    return rows;
  }
}
