import type { ApiClient } from './client';

export interface WellnessInput {
  activeMinutes: number;
  sleepMinutes: number;
  averageHeartRateBpm: number;
  stepCount: number;
}

export interface WellnessResponse {
  activeScore: number;
  sleepScore: number;
  cardiovascularScore: number;
  compositeScore: number;
}

export class HealthApi {
  constructor(private readonly client: ApiClient) {}

  async wellness(input: WellnessInput): Promise<WellnessResponse> {
    return this.client.post<WellnessResponse>('/v1/health/wellness', input);
  }
}
