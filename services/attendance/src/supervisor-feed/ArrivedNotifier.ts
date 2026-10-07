import type { Redis } from 'ioredis';

export interface ArrivedEvent {
  orgId: number;
  employeeId: number;
  fullName: string;
  status: string;
  at: Date;
}

export class ArrivedNotifier {
  constructor(private readonly cacheRedis: Redis) {}

  async publish(event: ArrivedEvent): Promise<void> {
    const channel = `attendance.event.${event.orgId}`;
    await this.cacheRedis.publish(channel, JSON.stringify(event));
  }
}
