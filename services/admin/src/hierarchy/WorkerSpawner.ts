import type { Pool } from 'pg';

export interface DeactivateInput {
  actorOrgId: number;
  employeeId: number;
}

export class WorkerSpawner {
  constructor(private readonly pool: Pool) {}

  async deactivate(input: DeactivateInput): Promise<void> {
    const { rowCount } = await this.pool.query(
      `UPDATE employees SET is_active = FALSE
       WHERE employee_id = $1 AND org_id = $2`,
      [input.employeeId, input.actorOrgId],
    );
    if (rowCount === 0) {
      throw new Error('employee_not_found_or_cross_org');
    }
  }

  async reactivate(input: DeactivateInput): Promise<void> {
    const { rowCount } = await this.pool.query(
      `UPDATE employees SET is_active = TRUE
       WHERE employee_id = $1 AND org_id = $2`,
      [input.employeeId, input.actorOrgId],
    );
    if (rowCount === 0) {
      throw new Error('employee_not_found_or_cross_org');
    }
  }
}
