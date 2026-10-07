import type { Pool } from 'pg';

import { insideRadius } from './RadiusCalculator.js';

export class FiftyMeterGuard {
  constructor(private readonly pool: Pool) {}

  async check(
    orgId: number,
    observedLat: number,
    observedLon: number,
  ): Promise<{ inside: boolean; distanceMeters: number }> {
    const { rows } = await this.pool.query<{
      office_latitude: string;
      office_longitude: string;
    }>(
      'SELECT office_latitude, office_longitude FROM organizations WHERE org_id = $1',
      [orgId],
    );
    const row = rows[0];
    if (!row) {
      return { inside: false, distanceMeters: Number.POSITIVE_INFINITY };
    }

    const centerLat = Number.parseFloat(row.office_latitude);
    const centerLon = Number.parseFloat(row.office_longitude);

    const inside = insideRadius({
      centerLat,
      centerLon,
      pointLat: observedLat,
      pointLon: observedLon,
      allowedRadiusM: 50,
    });

    const distance = (await import('./RadiusCalculator.js')).distanceFromCenter({
      centerLat,
      centerLon,
      pointLat: observedLat,
      pointLon: observedLon,
      allowedRadiusM: 50,
    });

    return { inside, distanceMeters: Math.round(distance) };
  }
}
