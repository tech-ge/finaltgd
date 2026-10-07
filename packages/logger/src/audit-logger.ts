import type { Pool } from 'pg';

export interface AuditEntry {
  actorAccount: number | null;
  actorRole: string | null;
  action: string;
  targetType: string | null;
  targetRef: string | null;
  metadata: Record<string, unknown>;
  ipAddress: string | null;
}

export class AuditLogger {
  constructor(private readonly pool: Pool) {}

  async write(entry: AuditEntry): Promise<void> {
    try {
      await this.pool.query(
        `INSERT INTO audit_logs
           (actor_account, actor_role, action, target_type, target_ref, metadata, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)`,
        [
          entry.actorAccount,
          entry.actorRole,
          entry.action,
          entry.targetType,
          entry.targetRef,
          JSON.stringify(entry.metadata),
          entry.ipAddress,
        ],
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      console.error('audit_log_write_failed', message);
    }
  }
}
