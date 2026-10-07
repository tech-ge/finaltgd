import type { Pool } from 'pg';

import { normalizeIp } from './Ipv6Support.js';

export class CorporateIpMatcher {
  constructor(private readonly pool: Pool) {}

  async matches(orgId: number, observedIp: string): Promise<boolean> {
    const { rows } = await this.pool.query<{ office_static_ip: string }>(
      'SELECT office_static_ip FROM organizations WHERE org_id = $1',
      [orgId],
    );
    const row = rows[0];
    if (!row) {
      return false;
    }
    return normalizeIp(row.office_static_ip) === normalizeIp(observedIp);
  }
}
