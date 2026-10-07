import Fastify from 'fastify';
import { Redis } from 'ioredis';
import { MongoClient } from 'mongodb';
import { Pool } from 'pg';
import { z } from 'zod';

import { AlertDispatcher } from './fraud/AlertDispatcher.js';
import { detect as detectIp } from './fraud/IpMismatchDetector.js';
import { detect as detectMockGps } from './fraud/MockGpsDetector.js';
import { GoldLogExtractor } from './gold-logs/GoldLogExtractor.js';
import { filterQuality } from './gold-logs/QualityScorer.js';
import { AdminSpawner } from './hierarchy/AdminSpawner.js';
import { CeoService } from './hierarchy/CeoService.js';
import { SupervisorSpawner } from './hierarchy/SupervisorSpawner.js';
import { WorkerSpawner } from './hierarchy/WorkerSpawner.js';
import type { ActorContext, Role } from './hierarchy/RoleInheritance.js';
import { buildSnapshot } from './live-monitor/PresenceAggregator.js';
import { evaluateHandshake } from './live-monitor/IpGpsHandshake.js';
import { WorkerLocationFeed } from './live-monitor/WorkerLocationFeed.js';

interface Env {
  NODE_ENV: string;
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  POSTGRES_URL: string;
  MONGO_URL: string;
  REDIS_CACHE_URL: string;
  JWT_SECRET: string;
}

function loadEnv(): Env {
  const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SERVICE_NAME: z.string().default('admin'),
    PORT: z.coerce.number().int().positive().default(3008),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    POSTGRES_URL: z.string().min(1),
    MONGO_URL: z.string().min(1),
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

function actorFromHeaders(headers: Record<string, unknown>): ActorContext {
  const accountId = Number.parseInt(String(headers['x-actor-account-id'] ?? '0'), 10);
  const orgId = Number.parseInt(String(headers['x-actor-org-id'] ?? '0'), 10);
  const role = String(headers['x-actor-role'] ?? '') as Role;

  if (!accountId || !orgId || !role) {
    throw new Error('actor_context_missing');
  }
  return { accountId, orgId, role };
}

async function main(): Promise<void> {
  const env = loadEnv();

  const pool = new Pool({ connectionString: env.POSTGRES_URL, max: 20 });
  const cacheRedis = new Redis(env.REDIS_CACHE_URL);
  const mongoClient = new MongoClient(env.MONGO_URL);
  await mongoClient.connect();
  const mongoDb = mongoClient.db();

  const ceo = new CeoService(pool);
  const adminSpawner = new AdminSpawner(pool);
  const supervisorSpawner = new SupervisorSpawner(pool);
  const workerSpawner = new WorkerSpawner(pool);
  const locationFeed = new WorkerLocationFeed(pool);
  const alerts = new AlertDispatcher(cacheRedis);
  const goldExtractor = new GoldLogExtractor(mongoDb);

  const app = Fastify({ logger: { level: env.LOG_LEVEL } });

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/version', async () => ({
    service: env.SERVICE_NAME,
    version: '0.1.0',
    env: env.NODE_ENV,
  }));

  const SpawnSchema = z.object({
    orgId: z.number().int().positive(),
    fullName: z.string().min(1),
    deviceUuid: z.string().min(8),
  });

  app.post('/hierarchy/admin', async (request, reply) => {
    const parsed = SpawnSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const actor = actorFromHeaders(request.headers as Record<string, unknown>);
      const id = await ceo.createAdmin({ actor, ...parsed.data });
      return reply.code(201).send({ employeeId: id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(403).send({ error: message });
    }
  });

  app.post('/hierarchy/supervisor', async (request, reply) => {
    const parsed = SpawnSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const actor = actorFromHeaders(request.headers as Record<string, unknown>);
      const id = await adminSpawner.createSupervisor({ actor, ...parsed.data });
      return reply.code(201).send({ employeeId: id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(403).send({ error: message });
    }
  });

  app.post('/hierarchy/worker', async (request, reply) => {
    const parsed = SpawnSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const actor = actorFromHeaders(request.headers as Record<string, unknown>);
      const id = await supervisorSpawner.createWorker({ actor, ...parsed.data });
      return reply.code(201).send({ employeeId: id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(403).send({ error: message });
    }
  });

  app.post('/hierarchy/worker/deactivate', async (request, reply) => {
    const schema = z.object({ employeeId: z.number().int().positive() });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const actor = actorFromHeaders(request.headers as Record<string, unknown>);
      await workerSpawner.deactivate({ actorOrgId: actor.orgId, employeeId: parsed.data.employeeId });
      return reply.code(200).send({ deactivated: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  app.get('/live/:orgId', async (request, reply) => {
    const schema = z.object({ orgId: z.coerce.number().int().positive() });
    const parsed = schema.safeParse(request.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const locations = await locationFeed.latest(parsed.data.orgId);

    const { rows: totalRows } = await pool.query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM employees WHERE org_id = $1 AND is_active = TRUE',
      [parsed.data.orgId],
    );
    const total = Number.parseInt(totalRows[0]?.count ?? '0', 10);

    const snapshot = buildSnapshot(
      parsed.data.orgId,
      locations.map((l) => ({
        employeeId: l.employeeId,
        fullName: l.fullName,
        role: 'WORKER',
        lastSeenAt: l.observedAt,
        status: l.status,
      })),
      total,
    );

    return reply.code(200).send({ snapshot, locations });
  });

  const HandshakeSchema = z.object({
    employeeId: z.number().int().positive(),
    observedIp: z.string().min(1),
    observedLat: z.number(),
    observedLon: z.number(),
    orgIp: z.string().min(1),
    orgLat: z.number(),
    orgLon: z.number(),
  });

  app.post('/live/handshake', async (request, reply) => {
    const parsed = HandshakeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const result = evaluateHandshake(
      {
        orgId: 0,
        employeeId: parsed.data.employeeId,
        observedIp: parsed.data.observedIp,
        observedLat: parsed.data.observedLat,
        observedLon: parsed.data.observedLon,
      },
      parsed.data.orgIp,
      parsed.data.orgLat,
      parsed.data.orgLon,
    );

    return reply.code(200).send(result);
  });

  const FraudSchema = z.object({
    orgId: z.number().int().positive(),
    employeeId: z.number().int().positive(),
    kind: z.enum(['mock_gps', 'ip_mismatch', 'impossible_velocity']),
    severity: z.enum(['low', 'medium', 'high']),
    metadata: z.record(z.unknown()).default({}),
  });

  app.post('/fraud/alert', async (request, reply) => {
    const parsed = FraudSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    await alerts.dispatch({
      orgId: parsed.data.orgId,
      employeeId: parsed.data.employeeId,
      kind: parsed.data.kind,
      severity: parsed.data.severity,
      metadata: parsed.data.metadata,
      at: new Date(),
    });
    return reply.code(202).send({ dispatched: true });
  });

  const GpsSamplesSchema = z.object({
    samples: z.array(
      z.object({
        lat: z.number(),
        lon: z.number(),
        at: z.string(),
      }),
    ),
  });

  app.post('/fraud/mock-gps', async (request, reply) => {
    const parsed = GpsSamplesSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const samples = parsed.data.samples.map((s) => ({
      lat: s.lat,
      lon: s.lon,
      at: new Date(s.at),
    }));
    return reply.code(200).send(detectMockGps(samples));
  });

  app.post('/fraud/ip-mismatch', async (request, reply) => {
    const schema = z.object({
      registeredIp: z.string().min(1),
      observations: z.array(
        z.object({
          employeeId: z.number().int().positive(),
          observedIp: z.string().min(1),
          observedAt: z.string(),
        }),
      ),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const observations = parsed.data.observations.map((o) => ({
      employeeId: o.employeeId,
      observedIp: o.observedIp,
      observedAt: new Date(o.observedAt),
    }));
    const verdicts = detectIp(observations, parsed.data.registeredIp);
    return reply.code(200).send({ verdicts });
  });

  app.post('/gold-logs/export', async (request, reply) => {
    const schema = z.object({
      sinceIso: z.string(),
      limit: z.number().int().positive().max(10_000),
      minScore: z.number().min(0).max(1).default(0.7),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const candidates = await goldExtractor.extract({
      sinceIso: parsed.data.sinceIso,
      limit: parsed.data.limit,
    });
    const scored = filterQuality(
      candidates.map((c) => ({
        accountId: c.accountId,
        intent: c.intent,
        outcome: c.outcome,
        latencyMs: c.latencyMs,
        hadError: c.hadError,
      })),
      parsed.data.minScore,
    );
    return reply.code(200).send({ count: scored.length, logs: scored });
  });

  const shutdown = async (): Promise<void> => {
    await app.close();
    await mongoClient.close();
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
