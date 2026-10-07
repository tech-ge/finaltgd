import type { Pool } from 'pg';

import { assertCanCreate, type ActorContext } from './RoleInheritance.js';

export interface CreateSupervisorInput {
  actor: ActorContext;
  orgId: number;
  fullName: string;
  deviceUuid: string;
}

export class AdminSpawner {
  constructor(private readonly pool: Pool) {}

  async createSupervisor(input: CreateSupervisorInput): Promise<number> {
    if (input.actor.role !== 'ADMIN' && input.actor.role !== 'CEO') {
      throw new Error('admin_or_ceo_required');
    }
    if (input.actor.orgId !== input.orgId) {
      throw new Error('cross_org_creation_denied');
    }
    assertCanCreate(input.actor, 'SUPERVISOR');

    const { rows } = await this.pool.query<{ employee_id: number }>(
      `INSERT INTO employees (org_id, full_name, device_uuid, role)
       VALUES ($1, $2, $3, 'SUPERVISOR')
       RETURNING employee_id`,
      [input.orgId, input.fullName, input.deviceUuid],
    );

    const id = rows[0]?.employee_id;
    if (id === undefined) {
      throw new Error('create_supervisor_failed');
    }
    return id;
  }
}
