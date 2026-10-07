import type { Redis } from 'ioredis';

import type { WeatherSnapshot } from './WeatherApiClient.js';

const TTL_SECONDS = 600;

export class WeatherCache {
  constructor(private readonly redis: Redis) {}

  private key(lat: number, lon: number): string {
    return `weather:${lat.toFixed(2)}:${lon.toFixed(2)}`;
  }

  async get(lat: number, lon: number): Promise<WeatherSnapshot | null> {
    const raw = await this.redis.get(this.key(lat, lon));
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as WeatherSnapshot & { capturedAt: string };
      return { ...parsed, capturedAt: new Date(parsed.capturedAt) };
    } catch {
      return null;
    }
  }

  async set(lat: number, lon: number, snapshot: WeatherSnapshot): Promise<void> {
    await this.redis.set(
      this.key(lat, lon),
      JSON.stringify(snapshot),
      'EX',
      TTL_SECONDS,
    );
  }
}
