import type { RedisPubSub } from './RedisPubSub.js';

export interface AttendanceEvent {
  orgId: number;
  employeeId: number;
  status: string;
  at: Date;
}

export class AttendanceStream {
  constructor(private readonly pubsub: RedisPubSub) {}

  async emit(event: AttendanceEvent): Promise<void> {
    await this.pubsub.publish(`attendance.event.${event.orgId}`, JSON.stringify(event));
  }
}
