import type { WeatherSnapshot } from './WeatherApiClient.js';
import type { WeatherCache } from './WeatherCache.js';
import type { WeatherApiClient } from './WeatherApiClient.js';

export interface WeatherImpact {
  condition: string;
  impactLevel: 'none' | 'low' | 'moderate' | 'high';
  recommendedDelaySeconds: number;
}

export class WeatherAnalyzer {
  constructor(
    private readonly client: WeatherApiClient,
    private readonly cache: WeatherCache,
  ) {}

  async analyze(lat: number, lon: number): Promise<WeatherImpact> {
    const cached = await this.cache.get(lat, lon);
    const snapshot = cached ?? (await this.client.fetch({ lat, lon, at: new Date() }));
    if (!cached) {
      await this.cache.set(lat, lon, snapshot);
    }
    return this.impactOf(snapshot);
  }

  private impactOf(snapshot: WeatherSnapshot): WeatherImpact {
    const precip = snapshot.precipitationMm;
    if (precip <= 0) {
      return { condition: snapshot.condition, impactLevel: 'none', recommendedDelaySeconds: 0 };
    }
    if (precip < 2) {
      return { condition: snapshot.condition, impactLevel: 'low', recommendedDelaySeconds: 60 };
    }
    if (precip < 8) {
      return { condition: snapshot.condition, impactLevel: 'moderate', recommendedDelaySeconds: 240 };
    }
    return { condition: snapshot.condition, impactLevel: 'high', recommendedDelaySeconds: 600 };
  }
}
