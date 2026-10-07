import Fastify from 'fastify';
import { Redis } from 'ioredis';
import { Pool } from 'pg';
import { z } from 'zod';

import { evaluate as evaluateRefusal } from './agent-to-agent/RefusalEngine.js';
import { verifyEnvelope } from './agent-to-agent/RequestProtocol.js';
import { AiActionLogger } from './audit/AiActionLogger.js';
import { ImmutableTrail } from './audit/ImmutableTrail.js';
import { QueryInterface } from './audit/QueryInterface.js';
import { ConsentTracker } from './context-broker/ConsentTracker.js';
import { DataAccessBroker } from './context-broker/DataAccessBroker.js';
import { AiRestrictionScheduler } from './rules-engine/AiRestrictionScheduler.js';
import { detect } from './rules-engine/RuleBreakerDetector.js';
import { ViolationLog } from './rules-engine/ViolationLog.js';
import { HfSpaceClient } from './routing/HfSpaceClient.js';
import { route } from './routing/IntentRouter.js';

interface Env {
  NODE_ENV: string;
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  POSTGRES_URL: string;
  REDIS_URL: string;
  HF_TOKEN: string;
  HF_SHADOW_STUDENT_URL: string;
  HF_VOICE_CLONE_URL: string;
  HF_SPEECH_URL: string;
  JWT_SECRET: string;
}

function loadEnv(): Env {
  const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SERVICE_NAME: z.string().default('ai-orchestrator'),
    PORT: z.coerce.number().int().positive().default(3001),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    POSTGRES_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    HF_TOKEN: z.string().default(''),
    HF_SHADOW_STUDENT_URL: z.string().default(''),
    HF_VOICE_CLONE_URL: z.string().default(''),
    HF_SPEECH_URL: z.string().default(''),
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
  const cacheRedis = new Redis(env.REDIS_URL);

  const consents = new ConsentTracker();
  const broker = new DataAccessBroker(pool, consents);
  const restrictions = new AiRestrictionScheduler(pool);
  const violations = new ViolationLog(pool);
  const actionLog = new AiActionLogger(pool);
  const trail = new ImmutableTrail();
  const trailQuery = new QueryInterface(trail);
  const hf = new HfSpaceClient();

  const app = Fastify({ logger: { level: env.LOG_LEVEL } });

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/version', async () => ({
    service: env.SERVICE_NAME,
    version: '0.1.0',
    env: env.NODE_ENV,
  }));

  const ConsentSchema = z.object({
    accountId: z.number().int().positive(),
    scope: z.string().min(1),
    granted: z.boolean(),
  });

  app.post('/consent', async (request, reply) => {
    const parsed = ConsentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    if (parsed.data.granted) {
      consents.record({
        accountId: parsed.data.accountId,
        scope: parsed.data.scope,
        granted: true,
        recordedAt: new Date(),
      });
    } else {
      consents.revoke(parsed.data.accountId, parsed.data.scope);
    }
    return reply.code(200).send({ recorded: true });
  });

  const ContextSchema = z.object({
    accountId: z.number().int().positive(),
    scope: z.enum([
      'balance.read',
      'activity.read',
      'location.read',
      'microphone.read',
      'health.read',
      'business.read',
      'call.history.read',
    ]),
    requesterAgent: z.string().min(1),
  });

  app.post('/context/read', async (request, reply) => {
    const parsed = ContextSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const result = await broker.read(parsed.data);
      trail.append({ kind: 'context.read', request: parsed.data });
      return reply.code(200).send(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      await actionLog.log({
        accountId: parsed.data.accountId,
        intent: `context.${parsed.data.scope}`,
        outcome: 'refused',
        metadata: { reason: message },
      });
      return reply.code(403).send({ error: message });
    }
  });

  const AgentMessageSchema = z.object({
    messageId: z.string().min(1),
    type: z.enum([
      'request',
      'response',
      'notification',
      'command',
      'instruction',
      'directive',
      'order',
    ]),
    fromAgent: z.string().min(1),
    toAgent: z.string().min(1),
    intent: z.string().min(1),
    payload: z.record(z.unknown()),
    issuedAt: z.number(),
    signature: z.string().min(1),
  });

  app.post('/agent-to-agent', async (request, reply) => {
    const parsed = AgentMessageSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    if (!verifyEnvelope(parsed.data, env.JWT_SECRET)) {
      return reply.code(401).send({ error: 'signature_invalid' });
    }

    const refusal = evaluateRefusal(parsed.data);
    if (refusal) {
      return reply.code(200).send(refusal);
    }

    const decision = route(parsed.data.intent);
    const endpoint =
      decision.model === 'shadow-student'
        ? env.HF_SHADOW_STUDENT_URL
        : decision.model === 'voice-clone'
        ? env.HF_VOICE_CLONE_URL
        : env.HF_SPEECH_URL;

    const result = await hf.call({
      url: endpoint,
      path: decision.path,
      body: parsed.data.payload,
      token: env.HF_TOKEN,
      timeoutMs: 15_000,
    });

    trail.append({
      kind: 'agent.message',
      from: parsed.data.fromAgent,
      intent: parsed.data.intent,
    });

    return reply.code(result.ok ? 200 : result.status).send(result.body);
  });

  const InvokeSchema = z.object({
    accountId: z.number().int().positive(),
    intent: z.string().min(1),
    payload: z.record(z.unknown()),
  });

  app.post('/invoke', async (request, reply) => {
    const parsed = InvokeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    if (await restrictions.activeFor(parsed.data.accountId)) {
      await actionLog.log({
        accountId: parsed.data.accountId,
        intent: parsed.data.intent,
        outcome: 'refused',
        metadata: { reason: 'ai_restricted' },
      });
      return reply.code(403).send({ error: 'ai_restricted' });
    }

    const decision = route(parsed.data.intent);
    const endpoint =
      decision.model === 'shadow-student'
        ? env.HF_SHADOW_STUDENT_URL
        : decision.model === 'voice-clone'
        ? env.HF_VOICE_CLONE_URL
        : env.HF_SPEECH_URL;

    const result = await hf.call({
      url: endpoint,
      path: decision.path,
      body: parsed.data.payload,
      token: env.HF_TOKEN,
      timeoutMs: 15_000,
    });

    await actionLog.log({
      accountId: parsed.data.accountId,
      intent: parsed.data.intent,
      outcome: result.ok ? 'accepted' : 'failed',
      metadata: { model: decision.model },
    });

    trail.append({
      kind: 'invoke',
      accountId: parsed.data.accountId,
      intent: parsed.data.intent,
    });

    return reply.code(result.ok ? 200 : result.status).send(result.body);
  });

  const ViolationSchema = z.object({
    accountId: z.number().int().positive(),
    code: z.string().min(1),
    metadata: z.record(z.unknown()).default({}),
  });

  app.post('/rules/violate', async (request, reply) => {
    const parsed = ViolationSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const detection = detect({ code: parsed.data.code });
    if (!detection.breached) {
      return reply.code(200).send({ breached: false });
    }

    await violations.write({
      accountId: parsed.data.accountId,
      code: detection.code,
      metadata: parsed.data.metadata,
      at: new Date(),
    });

    const startsAt = new Date();
    const endsAt = new Date(
      startsAt.getTime() + detection.restrictionDays * 24 * 60 * 60 * 1000,
    );

    const restrictionId = await restrictions.schedule({
      accountId: parsed.data.accountId,
      startsAt,
      endsAt,
      reason: detection.code,
    });

    trail.append({
      kind: 'restriction.scheduled',
      accountId: parsed.data.accountId,
      code: detection.code,
    });

    return reply.code(201).send({
      breached: true,
      restrictionId,
      restrictionDays: detection.restrictionDays,
      endsAt,
    });
  });

  app.get('/audit/count', async () => ({ count: trailQuery.count() }));
  app.get('/audit/verify', async () => ({ valid: trail.verify() }));

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
