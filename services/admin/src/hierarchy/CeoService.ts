import type { Pool } from 'pg';

import { assertCanCreate, type ActorContext } from './RoleInheritance.js';

export interface CreateAdminInput {
  actor: ActorContext;
  orgId: number;
  fullName: string;
  deviceUuid: string;
}

export class CeoService {
  constructor(private readonly pool: Pool) {}

  async createAdmin(input: CreateAdminInput): Promise<number> {
    if (input.actor.role !== 'CEO') {
      throw new Error('ceo_required');
    }
    if (input.actor.orgId !== input.orgId) {
      throw new Error('cross_org_creation_denied');
    }
    assertCanCreate(input.actor, 'ADMIN');

    const { rows } = await this.pool.query<{ employee_id: number }>(
      `INSERT INTO employees (org_id, full_name, device_uuid, role)
       VALUES ($1, $2, $3, 'ADMIN')
       RETURNING employee_id`,
      [input.orgId, input.fullName, input.deviceUuid],
    );

    const id = rows[0]?.employee_id;
    if (id === undefined) {
      throw new Error('create_admin_failed');
    }
    return id;
  }
}
