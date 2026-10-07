import type { MeetupZoneConfig } from './MeetupZone.js';
import { isInsideZone } from './MeetupZone.js';

export interface FenceEvent {
  accountId: number;
  entered: boolean;
  at: Date;
}

export class FenceWatcher {
  private readonly inside = new Map<number, boolean>();
  private readonly zone: MeetupZoneConfig;

  constructor(zone: MeetupZoneConfig) {
    this.zone = zone;
  }

  observe(accountId: number, lat: number, lon: number): FenceEvent | null {
    const nowInside = isInsideZone(this.zone, lat, lon);
    const wasInside = this.inside.get(accountId);
    this.inside.set(accountId, nowInside);

    if (wasInside === undefined || wasInside === nowInside) {
      return null;
    }

    return { accountId, entered: nowInside, at: new Date() };
  }
}
