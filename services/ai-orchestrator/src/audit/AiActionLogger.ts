import type { Pool } from 'pg';

export interface AiAction {
  accountId: number;
  intent: string;
  outcome: 'accepted' | 'refused' | 'failed';
  metadata: Record<string, unknown>;
}

export class AiActionLogger {
  constructor(private readonly pool: Pool) {}

  async log(action: AiAction): Promise<void> {
    await this.pool.query(
      `INSERT INTO audit_logs (actor_account, action, target_type, target_ref, metadata)
       VALUES ($1, 'ai_action', 'account', $2, $3::jsonb)`,
      [
        action.accountId,
        String(action.accountId),
        JSON.stringify({
          intent: action.intent,
          outcome: action.outcome,
          ...action.metadata,
        }),
      ],
    );
  }
}
