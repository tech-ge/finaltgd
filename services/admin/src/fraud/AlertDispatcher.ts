import type { Redis } from 'ioredis';

export interface FraudAlert {
  orgId: number;
  employeeId: number;
  kind: 'mock_gps' | 'ip_mismatch' | 'impossible_velocity';
  severity: 'low' | 'medium' | 'high';
  metadata: Record<string, unknown>;
  at: Date;
}

export class AlertDispatcher {
  constructor(private readonly cacheRedis: Redis) {}

  async dispatch(alert: FraudAlert): Promise<void> {
    const channel = `fraud.alert.${alert.orgId}`;
    await this.cacheRedis.publish(channel, JSON.stringify(alert));
  }
}
