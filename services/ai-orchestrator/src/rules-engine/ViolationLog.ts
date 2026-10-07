import type { Pool } from 'pg';

export interface ViolationRecord {
  accountId: number;
  code: string;
  metadata: Record<string, unknown>;
  at: Date;
}

export class ViolationLog {
  constructor(private readonly pool: Pool) {}

  async write(record: ViolationRecord): Promise<void> {
    await this.pool.query(
      `INSERT INTO audit_logs (actor_account, action, target_type, target_ref, metadata)
       VALUES ($1, 'rule_violation', 'account', $2, $3::jsonb)`,
      [
        record.accountId,
        String(record.accountId),
        JSON.stringify({ code: record.code, ...record.metadata }),
      ],
    );
  }
}
