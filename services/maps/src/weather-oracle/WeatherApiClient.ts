export interface WeatherQuery {
  lat: number;
  lon: number;
  at: Date;
}

export interface WeatherSnapshot {
  temperatureC: number;
  precipitationMm: number;
  windKph: number;
  condition: string;
  capturedAt: Date;
}

export interface WeatherApiConfig {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
}

export class WeatherApiClient {
  constructor(private readonly config: WeatherApiConfig) {}

  async fetch(query: WeatherQuery): Promise<WeatherSnapshot> {
    if (!this.config.apiKey) {
      throw new Error('weather_api_key_missing');
    }

    const url = new URL(`${this.config.baseUrl}/current`);
    url.searchParams.set('lat', String(query.lat));
    url.searchParams.set('lon', String(query.lon));
    url.searchParams.set('at', query.at.toISOString());

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(url, {
        headers: { 'X-Api-Key': this.config.apiKey },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`weather_api_status_${response.status}`);
      }

      const body = (await response.json()) as Partial<WeatherSnapshot>;
      if (
        typeof body.temperatureC !== 'number' ||
        typeof body.precipitationMm !== 'number'
      ) {
        throw new Error('weather_api_malformed_response');
      }

      return {
        temperatureC: body.temperatureC,
        precipitationMm: body.precipitationMm,
        windKph: typeof body.windKph === 'number' ? body.windKph : 0,
        condition: typeof body.condition === 'string' ? body.condition : 'unknown',
        capturedAt: new Date(),
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
