import type { Pool } from 'pg';

export interface DisputeRecord {
  actorAccount: number;
  approverAccount: number;
  targetAccount: number;
  reason: string;
}

export class DisputeAccess {
  constructor(private readonly pool: Pool) {}

  async open(input: DisputeRecord): Promise<number> {
    if (input.actorAccount === input.approverAccount) {
      throw new Error('two_person_rule_violated');
    }
    if (input.reason.trim().length < 10) {
      throw new Error('dispute_reason_too_short');
    }

    const { rows } = await this.pool.query<{ log_id: number }>(
      `INSERT INTO audit_logs
         (actor_account, action, target_type, target_ref, metadata)
       VALUES ($1, 'dispute_open', 'account', $2, $3::jsonb)
       RETURNING log_id`,
      [
        input.actorAccount,
        String(input.targetAccount),
        JSON.stringify({
          reason: input.reason,
          approver: input.approverAccount,
        }),
      ],
    );

    const id = rows[0]?.log_id;
    if (id === undefined) {
      throw new Error('dispute_open_failed');
    }
    return id;
  }

  async logAccess(disputeId: number, actorAccount: number, targetAccount: number): Promise<void> {
    await this.pool.query(
      `INSERT INTO audit_logs
         (actor_account, action, target_type, target_ref, metadata)
       VALUES ($1, 'dispute_read', 'identity', $2, $3::jsonb)`,
      [actorAccount, String(targetAccount), JSON.stringify({ disputeId })],
    );
  }
}
