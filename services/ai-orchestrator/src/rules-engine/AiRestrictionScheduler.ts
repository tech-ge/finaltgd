import type { Pool } from 'pg';

export interface RestrictionWindow {
  accountId: number;
  startsAt: Date;
  endsAt: Date;
  reason: string;
}

export class AiRestrictionScheduler {
  constructor(private readonly pool: Pool) {}

  async schedule(window: RestrictionWindow): Promise<number> {
    const { rows } = await this.pool.query<{ restriction_id: number }>(
      `INSERT INTO ai_restrictions (account_id, reason, starts_at, ends_at, is_active)
       VALUES ($1, $2, $3, $4, TRUE)
       RETURNING restriction_id`,
      [window.accountId, window.reason, window.startsAt, window.endsAt],
    );
    const id = rows[0]?.restriction_id;
    if (id === undefined) {
      throw new Error('restriction_schedule_failed');
    }
    return id;
  }

  async activeFor(accountId: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      `SELECT 1 FROM ai_restrictions
       WHERE account_id = $1
         AND is_active = TRUE
         AND CURRENT_TIMESTAMP BETWEEN starts_at AND ends_at
       LIMIT 1`,
      [accountId],
    );
    return rows.length > 0;
  }

  async expire(): Promise<void> {
    await this.pool.query(
      `UPDATE ai_restrictions
       SET is_active = FALSE
       WHERE is_active = TRUE AND ends_at < CURRENT_TIMESTAMP`,
    );
  }
}
