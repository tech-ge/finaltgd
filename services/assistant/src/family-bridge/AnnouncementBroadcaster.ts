import type { Redis } from 'ioredis';

export interface Announcement {
  circleId: number;
  fromAccount: number;
  message: string;
  at: Date;
}

export class AnnouncementBroadcaster {
  constructor(private readonly cacheRedis: Redis) {}

  async broadcast(announcement: Announcement): Promise<void> {
    const channel = `family.circle.${announcement.circleId}`;
    await this.cacheRedis.publish(channel, JSON.stringify(announcement));
  }
}
