import type { RedisLimiter } from './RedisLimiter.js';

export interface QuotaConfig {
  userPerMinute: number;
  financialPerMinute: number;
  aiPerMinute: number;
}

export const DEFAULT_QUOTA: QuotaConfig = {
  userPerMinute: 300,
  financialPerMinute: 30,
  aiPerMinute: 60,
};

export class PerUserQuota {
  constructor(private readonly limiter: RedisLimiter, private readonly quota: QuotaConfig) {}

  async check(accountId: number, scope: keyof QuotaConfig): Promise<{ allowed: boolean; remaining: number }> {
    const max = this.quota[scope];
    return this.limiter.check(`${scope}:${accountId}`, max, 60);
  }
}
