import type { Pool } from 'pg';

import { FiftyMeterGuard } from '../geofence-matcher/FiftyMeterGuard.js';
import { CorporateIpMatcher } from '../ip-verifier/CorporateIpMatcher.js';
import { classify, type VerificationStatus } from './DualMatchRule.js';
import { LogWriter } from './LogWriter.js';

export interface TriggerInput {
  employeeId: number;
  orgId: number;
  observedIp: string;
  observedLat: number;
  observedLon: number;
}

export interface TriggerResult {
  logId: number;
  status: VerificationStatus;
  distanceMeters: number;
}

export class TriggerEngine {
  private readonly ip: CorporateIpMatcher;
  private readonly geo: FiftyMeterGuard;
  private readonly writer: LogWriter;

  constructor(pool: Pool) {
    this.ip = new CorporateIpMatcher(pool);
    this.geo = new FiftyMeterGuard(pool);
    this.writer = new LogWriter(pool);
  }

  async evaluate(input: TriggerInput): Promise<TriggerResult> {
    const ipMatches = await this.ip.matches(input.orgId, input.observedIp);
    const geoCheck = await this.geo.check(input.orgId, input.observedLat, input.observedLon);

    const status = classify({
      ipMatches,
      insideGeofence: geoCheck.inside,
    });

    const logId = await this.writer.write({
      employeeId: input.employeeId,
      verifiedIp: input.observedIp,
      lat: input.observedLat,
      lon: input.observedLon,
      status,
    });

    return {
      logId,
      status,
      distanceMeters: geoCheck.distanceMeters,
    };
  }
}
