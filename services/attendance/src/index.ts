import Fastify from 'fastify';
import { Redis } from 'ioredis';
import { Pool } from 'pg';
import { z } from 'zod';

import { TriggerEngine } from './auto-checkin/TriggerEngine.js';
import { resolvePublicIp } from './ip-verifier/PublicIpResolver.js';
import { ArrivedNotifier } from './supervisor-feed/ArrivedNotifier.js';
import { LiveMapFeed } from './supervisor-feed/LiveMapFeed.js';
import { buildSnapshot } from './supervisor-feed/PresenceAggregator.js';

interface Env {
  NODE_ENV: string;
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  POSTGRES_URL: string;
  REDIS_CACHE_URL: string;
  JWT_SECRET: string;
}

function loadEnv(): Env {
  const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SERVICE_NAME: z.string().default('attendance'),
    PORT: z.coerce.number().int().positive().default(3005),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    POSTGRES_URL: z.string().min(1),
    REDIS_CACHE_URL: z.string().min(1),
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

  const pool = new Pool({ connectionString: env.POSTGRES_URL, max: 20 });
  const cacheRedis = new Redis(env.REDIS_CACHE_URL);

  const trigger = new TriggerEngine(pool);
  const feed = new LiveMapFeed(pool);
  const notifier = new ArrivedNotifier(cacheRedis);

  const app = Fastify({ logger: { level: env.LOG_LEVEL } });

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/version', async () => ({
    service: env.SERVICE_NAME,
    version: '0.1.0',
    env: env.NODE_ENV,
  }));

  const CheckInSchema = z.object({
    employeeId: z.number().int().positive(),
    orgId: z.number().int().positive(),
    observedLat: z.number(),
    observedLon: z.number(),
  });

  app.post('/checkin', async (request, reply) => {
    const parsed = CheckInSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const observedIp = resolvePublicIp({
      connectingIp: request.headers['cf-connecting-ip'] as string | undefined,
      realIp: request.headers['x-real-ip'] as string | undefined,
      forwardedFor: request.headers['x-forwarded-for'] as string | undefined,
    });

    if (!observedIp) {
      return reply.code(400).send({ error: 'public_ip_unresolved' });
    }

    try {
      const result = await trigger.evaluate({
        employeeId: parsed.data.employeeId,
        orgId: parsed.data.orgId,
        observedIp,
        observedLat: parsed.data.observedLat,
        observedLon: parsed.data.observedLon,
      });

      await notifier.publish({
        orgId: parsed.data.orgId,
        employeeId: parsed.data.employeeId,
        fullName: '',
        status: result.status,
        at: new Date(),
      });

      return reply.code(201).send(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  app.get('/presence/:orgId', async (request, reply) => {
    const schema = z.object({ orgId: z.coerce.number().int().positive() });
    const parsed = schema.safeParse(request.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const rows = await feed.latestForOrg(parsed.data.orgId);

    const { rows: totalRows } = await pool.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM employees WHERE org_id = $1 AND is_active = TRUE',
      [parsed.data.orgId],
    );
    const total = Number.parseInt(totalRows[0]?.count ?? '0', 10);

    const snapshot = buildSnapshot(
      parsed.data.orgId,
      rows.map((r) => ({
        employeeId: r.employeeId,
        fullName: r.fullName,
        role: 'WORKER',
        lastSeenAt: r.clockInTime,
        status: r.status,
      })),
      total,
    );

    return reply.code(200).send(snapshot);
  });

  const shutdown = async (): Promise<void> => {
    await app.close();
    await cacheRedis.quit();
    await pool.end();
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
