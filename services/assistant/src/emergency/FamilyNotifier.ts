import type { Redis } from 'ioredis';

export interface FamilyAlert {
  accountId: number;
  trigger: string;
  location?: { lat: number; lon: number };
  at: Date;
}

export class FamilyNotifier {
  constructor(private readonly cacheRedis: Redis) {}

  async notify(alert: FamilyAlert): Promise<void> {
    const channel = `family.alert.${alert.accountId}`;
    await this.cacheRedis.publish(channel, JSON.stringify(alert));
  }
}
