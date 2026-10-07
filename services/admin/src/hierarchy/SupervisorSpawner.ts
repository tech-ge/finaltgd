import type { Pool } from 'pg';

import { assertCanCreate, type ActorContext } from './RoleInheritance.js';

export interface CreateWorkerInput {
  actor: ActorContext;
  orgId: number;
  fullName: string;
  deviceUuid: string;
}

export class SupervisorSpawner {
  constructor(private readonly pool: Pool) {}

  async createWorker(input: CreateWorkerInput): Promise<number> {
    if (input.actor.role !== 'SUPERVISOR' && input.actor.role !== 'ADMIN' && input.actor.role !== 'CEO') {
      throw new Error('supervisor_or_higher_required');
    }
    if (input.actor.orgId !== input.orgId) {
      throw new Error('cross_org_creation_denied');
    }
    assertCanCreate(input.actor, 'WORKER');

    const { rows } = await this.pool.query<{ employee_id: number }>(
      `INSERT INTO employees (org_id, full_name, device_uuid, role)
       VALUES ($1, $2, $3, 'WORKER')
       RETURNING employee_id`,
      [input.orgId, input.fullName, input.deviceUuid],
    );

    const id = rows[0]?.employee_id;
    if (id === undefined) {
      throw new Error('create_worker_failed');
    }
    return id;
  }
}
