import type { Pool } from 'pg';

import { ConsentTracker } from './ConsentTracker.js';
import { grant, isActive, type Scope, type ScopeGrant } from './ScopedPermission.js';

export interface ContextRequest {
  accountId: number;
  scope: Scope;
  requesterAgent: string;
}

export interface ContextResponse {
  scope: Scope;
  data: Record<string, unknown>;
  grant: ScopeGrant;
}

export class DataAccessBroker {
  constructor(private readonly pool: Pool, private readonly consents: ConsentTracker) {}

  async read(request: ContextRequest): Promise<ContextResponse> {
    if (!this.consents.has(request.accountId, request.scope)) {
      throw new Error('consent_missing');
    }

    const grantEntry = grant(request.scope);

    switch (request.scope) {
      case 'balance.read': {
        const { rows } = await this.pool.query<{ fn_balance_check: string }>(
          'SELECT fn_balance_check($1) AS fn_balance_check',
          [request.accountId],
        );
        return {
          scope: request.scope,
          data: { balance: rows[0]?.fn_balance_check ?? '0' },
          grant: grantEntry,
        };
      }
      case 'activity.read': {
        const { rows } = await this.pool.query(
          `SELECT transfer_id, operation, amount, created_at
           FROM ledger_transfers
           WHERE from_account = $1 OR to_account = $1
           ORDER BY created_at DESC
           LIMIT 20`,
          [request.accountId],
        );
        return { scope: request.scope, data: { activity: rows }, grant: grantEntry };
      }
      case 'location.read': {
        const { rows } = await this.pool.query(
          `SELECT verified_latitude, verified_longitude, clock_in_time
           FROM attendance_logs
           WHERE employee_id = $1
           ORDER BY clock_in_time DESC
           LIMIT 1`,
          [request.accountId],
        );
        return { scope: request.scope, data: { location: rows[0] ?? null }, grant: grantEntry };
      }
      case 'health.read': {
        return { scope: request.scope, data: { vitals: null }, grant: grantEntry };
      }
      default: {
        if (!isActive(grantEntry)) {
          throw new Error('grant_expired');
        }
        return { scope: request.scope, data: {}, grant: grantEntry };
      }
    }
  }
}
