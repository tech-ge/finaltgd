import type { Pool } from 'pg';

import type { VerificationStatus } from './DualMatchRule.js';

export interface WriteLogInput {
  employeeId: number;
  verifiedIp: string;
  lat: number;
  lon: number;
  status: VerificationStatus;
}

export class LogWriter {
  constructor(private readonly pool: Pool) {}

  async write(input: WriteLogInput): Promise<number> {
    const { rows } = await this.pool.query<{ log_id: number }>(
      `INSERT INTO attendance_logs
         (employee_id, verified_ip, verified_latitude, verified_longitude, verification_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING log_id`,
      [
        input.employeeId,
        input.verifiedIp,
        input.lat,
        input.lon,
        input.status,
      ],
    );
    const id = rows[0]?.log_id;
    if (id === undefined) {
      throw new Error('attendance_log_insert_failed');
    }
    return id;
  }
}
