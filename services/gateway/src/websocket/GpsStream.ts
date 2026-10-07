import type { RedisPubSub } from './RedisPubSub.js';

export interface GpsEvent {
  orgId: number;
  employeeId: number;
  lat: number;
  lon: number;
  at: string;
}

export class GpsStream {
  constructor(private readonly pubsub: RedisPubSub) {}

  async emit(event: GpsEvent): Promise<void> {
    await this.pubsub.publish(`gps.live.${event.orgId}`, event);
  }
}
