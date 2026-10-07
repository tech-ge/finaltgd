import Fastify from 'fastify';
import { Redis } from 'ioredis';
import { z } from 'zod';

import { FenceWatcher } from './geo-fence/FenceWatcher.js';
import { isInsideZone } from './geo-fence/MeetupZone.js';
import { TwoPointRouter } from './routing/TwoPointRouter.js';
import { evaluate } from './routing/FeasibilityEngine.js';
import { rankRoutes } from './routing/RouteComparator.js';
import { classifyMany } from './traffic-ingest/CongestionModel.js';
import { aggregate, type SpeedSample } from './traffic-ingest/CrowdSpeedAggregator.js';
import { summarize } from './traffic-ingest/TrafficLightLogger.js';
import { WeatherAnalyzer } from './weather-oracle/WeatherAnalyzer.js';
import { WeatherApiClient } from './weather-oracle/WeatherApiClient.js';
import { WeatherCache } from './weather-oracle/WeatherCache.js';

interface Env {
  NODE_ENV: string;
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  REDIS_CACHE_URL: string;
  MAPS_API_KEY: string;
  WEATHER_API_KEY: string;
  JWT_SECRET: string;
}

function loadEnv(): Env {
  const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SERVICE_NAME: z.string().default('maps'),
    PORT: z.coerce.number().int().positive().default(3004),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    REDIS_CACHE_URL: z.string().min(1),
    MAPS_API_KEY: z.string().default(''),
    WEATHER_API_KEY: z.string().default(''),
    JWT_SECRET: z.string().min(32),
  });
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`invalid_environment: ${issues}`);
  }
  return parsed.data;
}

async function main(): Promise<void> {
  const env = loadEnv();
  const cacheRedis = new Redis(env.REDIS_CACHE_URL);

  const weather = new WeatherAnalyzer(
    new WeatherApiClient({
      apiKey: env.WEATHER_API_KEY,
      baseUrl: 'https://api.open-meteo.com/v1',
      timeoutMs: 5_000,
    }),
    new WeatherCache(cacheRedis),
  );

  const router = new TwoPointRouter(async (req) => {
    const distance = Math.abs(req.origin.lat - req.destination.lat) * 111_000;
    return [
      {
        id: 'primary',
        path: [req.origin, req.destination],
        distanceMeters: distance,
        etaSeconds: distance / 8,
        congestionScore: 0.2,
      },
    ];
  });

  const app = Fastify({ logger: { level: env.LOG_LEVEL } });

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/version', async () => ({
    service: env.SERVICE_NAME,
    version: '0.1.0',
    env: env.NODE_ENV,
  }));

  const CoordSchema = z.object({ lat: z.number(), lon: z.number() });

  app.post('/route', async (request, reply) => {
    const schema = z.object({
      origin: CoordSchema,
      destination: CoordSchema,
      departAt: z.string(),
      arriveBy: z.string().optional(),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const req = {
      origin: parsed.data.origin,
      destination: parsed.data.destination,
      departAt: new Date(parsed.data.departAt),
    };

    const options = await router.plan(req);
    const ranked = rankRoutes(options);

    if (parsed.data.arriveBy) {
      const availSeconds =
        (new Date(parsed.data.arriveBy).getTime() - req.departAt.getTime()) / 1000;
      const verdict = evaluate(ranked, availSeconds);
      return reply.code(200).send({ routes: ranked, verdict });
    }

    return reply.code(200).send({ routes: ranked });
  });

  app.post('/traffic/aggregate', async (request, reply) => {
    const schema = z.object({
      samples: z.array(
        z.object({
          segmentId: z.string(),
          speedMps: z.number(),
          observedAt: z.string(),
          weight: z.number(),
        }),
      ),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const samples: SpeedSample[] = parsed.data.samples.map((s) => ({
      segmentId: s.segmentId,
      speedMps: s.speedMps,
      observedAt: new Date(s.observedAt),
      weight: s.weight,
    }));

    const aggregated = aggregate(samples);
    return reply.code(200).send({
      segments: aggregated,
      congestion: classifyMany(aggregated),
    });
  });

  app.post('/traffic/stops', async (request, reply) => {
    const schema = z.object({
      events: z.array(
        z.object({
          intersectionId: z.string(),
          arrivedAt: z.string(),
          departedAt: z.string(),
        }),
      ),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const stats = summarize(
      parsed.data.events.map((e) => ({
        intersectionId: e.intersectionId,
        arrivedAt: new Date(e.arrivedAt),
        departedAt: new Date(e.departedAt),
      })),
    );
    return reply.code(200).send({ intersections: stats });
  });

  app.post('/weather/impact', async (request, reply) => {
    const parsed = CoordSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const impact = await weather.analyze(parsed.data.lat, parsed.data.lon);
      return reply.code(200).send(impact);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(503).send({ error: message });
    }
  });

  app.post('/geofence/check', async (request, reply) => {
    const schema = z.object({
      center: CoordSchema,
      radiusMeters: z.number().positive(),
      point: CoordSchema,
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const inside = isInsideZone(
      {
        centerLat: parsed.data.center.lat,
        centerLon: parsed.data.center.lon,
        radiusMeters: parsed.data.radiusMeters,
      },
      parsed.data.point.lat,
      parsed.data.point.lon,
    );
    return reply.code(200).send({ inside });
  });

  app.post('/geofence/watch', async (request, reply) => {
    const schema = z.object({
      center: CoordSchema,
      radiusMeters: z.number().positive(),
      observations: z.array(
        z.object({
          accountId: z.number().int().positive(),
          lat: z.number(),
          lon: z.number(),
        }),
      ),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const watcher = new FenceWatcher({
      centerLat: parsed.data.center.lat,
      centerLon: parsed.data.center.lon,
      radiusMeters: parsed.data.radiusMeters,
    });

    const events = parsed.data.observations
      .map((o) => watcher.observe(o.accountId, o.lat, o.lon))
      .filter((e): e is NonNullable<typeof e> => e !== null);

    return reply.code(200).send({ events });
  });

  const shutdown = async (): Promise<void> => {
    await app.close();
    await cacheRedis.quit();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown());
  process.on('SIGTERM', () => void shutdown());

  await app.listen({ host: '0.0.0.0', port: env.PORT });
}

main().catch((err) => {
  console.error('fatal_startup_error', err);
  process.exit(1);
});
