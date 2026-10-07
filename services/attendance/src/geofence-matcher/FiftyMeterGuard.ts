import type { Pool } from 'pg';

import { distanceFromCenter, insideRadius, validateCoordinates } from './RadiusCalculator.js';

export interface GeofenceCheck {
  inside: boolean;
  distanceMeters: number;
}

export class FiftyMeterGuard {
  constructor(private readonly pool: Pool) {}

  async check(
    orgId: number,
    observedLat: number,
    observedLon: number,
  ): Promise<GeofenceCheck> {
    validateCoordinates(observedLat, observedLon);

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

    const input = {
      centerLat,
      centerLon,
      pointLat: observedLat,
      pointLon: observedLon,
      allowedRadiusM: 50,
    };

    return {
      inside: insideRadius(input),
      distanceMeters: Math.round(distanceFromCenter(input)),
    };
  }
}
