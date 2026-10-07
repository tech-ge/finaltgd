import Fastify from 'fastify';
import { Redis } from 'ioredis';
import { Pool } from 'pg';
import { z } from 'zod';

import { CallRecorder } from './call-agent/CallRecorder.js';
import { detect as detectAccident } from './emergency/AccidentDetector.js';
import { AutoDialer } from './emergency/AutoDialer.js';
import { EmergencyContacts } from './emergency/EmergencyContacts.js';
import { FamilyNotifier } from './emergency/FamilyNotifier.js';
import { detect as detectHealthEmergency } from './emergency/HealthEmergencyDetector.js';
import { AnnouncementBroadcaster } from './family-bridge/AnnouncementBroadcaster.js';
import { FamilyCircle } from './family-bridge/FamilyCircle.js';
import { GroupCallCoordinator } from './family-bridge/GroupCallCoordinator.js';
import { EnrollmentService } from './voice-clone/EnrollmentService.js';
import { HfVoiceClient } from './voice-clone/HfVoiceClient.js';
import { TtsSynthesizer } from './voice-clone/TtsSynthesizer.js';
import { VoiceVault } from './voice-clone/VoiceVault.js';

interface Env {
  NODE_ENV: string;
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  POSTGRES_URL: string;
  REDIS_URL: string;
  HF_TOKEN: string;
  HF_VOICE_CLONE_URL: string;
  JWT_SECRET: string;
}

function loadEnv(): Env {
  const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SERVICE_NAME: z.string().default('assistant'),
    PORT: z.coerce.number().int().positive().default(3002),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    POSTGRES_URL: z.string().min(1),
    REDIS_URL: z.string().min(1),
    HF_TOKEN: z.string().default(''),
    HF_VOICE_CLONE_URL: z.string().default(''),
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

  const vault = new VoiceVault(pool);
  const enrollment = new EnrollmentService(pool);
  const hf = new HfVoiceClient();
  const tts = new TtsSynthesizer(vault, hf, env.HF_VOICE_CLONE_URL, env.HF_TOKEN);

  const callRecorder = new CallRecorder();
  const emergencyContacts = new EmergencyContacts();
  const autoDialer = new AutoDialer((accountId) => emergencyContacts.list(accountId));
  const familyNotifier = new FamilyNotifier(cacheRedis);

  const familyCircles = new FamilyCircle(pool);
  const announcements = new AnnouncementBroadcaster(cacheRedis);
  const groupCalls = new GroupCallCoordinator();

  const app = Fastify({ logger: { level: env.LOG_LEVEL } });

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/version', async () => ({
    service: env.SERVICE_NAME,
    version: '0.1.0',
    env: env.NODE_ENV,
  }));

  const EnrollSchema = z.object({
    accountId: z.number().int().positive(),
    sampleRateHz: z.number().int().positive(),
    durationMs: z.number().int().positive(),
    pcmBase64: z.string().min(1),
  });

  app.post('/voice/enroll', async (request, reply) => {
    const parsed = EnrollSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const result = await enrollment.enroll({
        accountId: parsed.data.accountId,
        sample: {
          sampleRateHz: parsed.data.sampleRateHz,
          durationMs: parsed.data.durationMs,
          pcmBytes: Buffer.from(parsed.data.pcmBase64, 'base64'),
        },
      });
      return reply.code(201).send(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  const SynthSchema = z.object({
    accountId: z.number().int().positive(),
    text: z.string().min(1).max(2_000),
  });

  app.post('/voice/synthesize', async (request, reply) => {
    const parsed = SynthSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const result = await tts.synthesize(parsed.data);
      return reply.code(200).send(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  const CallLogSchema = z.object({
    accountId: z.number().int().positive(),
    callerNumber: z.string().min(4),
    durationSeconds: z.number().int().nonnegative(),
    outcome: z.string().min(1),
  });

  app.post('/call/log', async (request, reply) => {
    const parsed = CallLogSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    callRecorder.record({
      accountId: parsed.data.accountId,
      callerNumber: parsed.data.callerNumber,
      durationSeconds: parsed.data.durationSeconds,
      outcome: parsed.data.outcome,
      at: new Date(),
    });
    return reply.code(201).send({ recorded: true });
  });

  app.get('/call/history/:accountId', async (request, reply) => {
    const schema = z.object({ accountId: z.coerce.number().int().positive() });
    const parsed = schema.safeParse(request.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    return reply.code(200).send({ history: callRecorder.history(parsed.data.accountId) });
  });

  const AccidentSchema = z.object({
    samples: z.array(z.object({ gForce: z.number(), at: z.string() })),
  });

  app.post('/emergency/accident-check', async (request, reply) => {
    const parsed = AccidentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const verdict = detectAccident(
      parsed.data.samples.map((s) => ({ gForce: s.gForce, at: new Date(s.at) })),
    );
    return reply.code(200).send(verdict);
  });

  const HealthSchema = z.object({
    samples: z.array(z.object({ heartRateBpm: z.number(), at: z.string() })),
  });

  app.post('/emergency/health-check', async (request, reply) => {
    const parsed = HealthSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const verdict = detectHealthEmergency(
      parsed.data.samples.map((s) => ({ heartRateBpm: s.heartRateBpm, at: new Date(s.at) })),
    );
    return reply.code(200).send(verdict);
  });

  const TriggerSchema = z.object({
    accountId: z.number().int().positive(),
    trigger: z.enum(['accident.detected', 'health.crisis', 'voice.distress', 'manual']),
    location: z.object({ lat: z.number(), lon: z.number() }).optional(),
  });

  app.post('/emergency/trigger', async (request, reply) => {
    const parsed = TriggerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const plan = autoDialer.plan({
      accountId: parsed.data.accountId,
      trigger: parsed.data.trigger,
      location: parsed.data.location,
    });
    await familyNotifier.notify({
      accountId: parsed.data.accountId,
      trigger: parsed.data.trigger,
      location: parsed.data.location,
      at: new Date(),
    });
    return reply.code(202).send({ plan });
  });

  const CircleSchema = z.object({
    ownerAccount: z.number().int().positive(),
    name: z.string().min(1).max(120),
  });

  app.post('/family/circle', async (request, reply) => {
    const parsed = CircleSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const id = await familyCircles.create(parsed.data.ownerAccount, parsed.data.name);
      return reply.code(201).send({ circleId: id });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  const MemberSchema = z.object({
    circleId: z.number().int().positive(),
    accountId: z.number().int().positive(),
    role: z.enum(['OWNER', 'MEMBER', 'GUARDIAN']),
  });

  app.post('/family/member', async (request, reply) => {
    const parsed = MemberSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    await familyCircles.addMember(
      parsed.data.circleId,
      parsed.data.accountId,
      parsed.data.role,
    );
    return reply.code(201).send({ added: true });
  });

  app.get('/family/members/:circleId', async (request, reply) => {
    const schema = z.object({ circleId: z.coerce.number().int().positive() });
    const parsed = schema.safeParse(request.params);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const members = await familyCircles.listMembers(parsed.data.circleId);
    return reply.code(200).send({ members });
  });

  const AnnounceSchema = z.object({
    circleId: z.number().int().positive(),
    fromAccount: z.number().int().positive(),
    message: z.string().min(1).max(500),
  });

  app.post('/family/announce', async (request, reply) => {
    const parsed = AnnounceSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      await announcements.broadcast({
        circleId: parsed.data.circleId,
        fromAccount: parsed.data.fromAccount,
        message: parsed.data.message,
        at: new Date(),
      });
      return reply.code(202).send({ broadcast: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  const GroupCallSchema = z.object({
    circleId: z.number().int().positive(),
    participants: z.array(z.number().int().positive()).min(2),
  });

  app.post('/family/group-call', async (request, reply) => {
    const parsed = GroupCallSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const session = groupCalls.start(parsed.data.circleId, parsed.data.participants);
      return reply.code(201).send(session);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
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
