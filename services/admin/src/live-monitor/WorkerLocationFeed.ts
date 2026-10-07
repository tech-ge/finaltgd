import type { Pool } from 'pg';

export interface WorkerLocation {
  employeeId: number;
  fullName: string;
  lat: number;
  lon: number;
  status: string;
  observedAt: Date;
}

export class WorkerLocationFeed {
  constructor(private readonly pool: Pool) {}

  async latest(orgId: number): Promise<WorkerLocation[]> {
    const { rows } = await this.pool.query<{
      employee_id: number;
      full_name: string;
      verified_latitude: string | null;
      verified_longitude: string | null;
      verification_status: string;
      clock_in_time: Date;
    }>(
      `SELECT DISTINCT ON (al.employee_id)
              al.employee_id, e.full_name,
              al.verified_latitude, al.verified_longitude,
              al.verification_status, al.clock_in_time
       FROM attendance_logs al
       JOIN employees e ON e.employee_id = al.employee_id
       WHERE e.org_id = $1
         AND al.clock_in_time >= CURRENT_TIMESTAMP - INTERVAL '12 hours'
       ORDER BY al.employee_id, al.clock_in_time DESC`,
      [orgId],
    );

    return rows.map((r) => ({
      employeeId: r.employee_id,
      fullName: r.full_name,
      lat: Number.parseFloat(r.verified_latitude ?? '0'),
      lon: Number.parseFloat(r.verified_longitude ?? '0'),
      status: r.verification_status,
      observedAt: r.clock_in_time,
    }));
  }
}
