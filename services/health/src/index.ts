import Fastify from 'fastify';
import { Pool } from 'pg';
import { z } from 'zod';

import { BreathingAnalyzer } from './audio-analytics/BreathingAnalyzer.js';
import { FatigueIndicator } from './audio-analytics/FatigueIndicator.js';
import { OnDeviceModel } from './audio-analytics/OnDeviceModel.js';
import { VoiceDistressDetector } from './audio-analytics/VoiceDistressDetector.js';
import { evaluate } from './move-to-earn/AntiCheat.js';
import { evaluateProgress, type GoalDefinition } from './move-to-earn/GoalTracker.js';
import { computeReward } from './move-to-earn/RewardPipeline.js';
import { countSteps } from './move-to-earn/StepValidator.js';
import { buildVector } from './sensor-fusion/WellnessVector.js';

interface Env {
  NODE_ENV: string;
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  POSTGRES_URL: string;
  HF_SPEECH_URL: string;
  HF_TOKEN: string;
  JWT_SECRET: string;
}

function loadEnv(): Env {
  const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SERVICE_NAME: z.string().default('health'),
    PORT: z.coerce.number().int().positive().default(3006),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    POSTGRES_URL: z.string().min(1),
    HF_SPEECH_URL: z.string().default(''),
    HF_TOKEN: z.string().default(''),
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

  const model = new OnDeviceModel({
    endpointUrl: env.HF_SPEECH_URL,
    token: env.HF_TOKEN,
    timeoutMs: 6_000,
  });

  const breathing = new BreathingAnalyzer(model);
  const distress = new VoiceDistressDetector(model);
  const fatigue = new FatigueIndicator(model);

  const app = Fastify({ logger: { level: env.LOG_LEVEL } });

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/version', async () => ({
    service: env.SERVICE_NAME,
    version: '0.1.0',
    env: env.NODE_ENV,
  }));

  const AudioSchema = z.object({
    sampleRateHz: z.number().int().positive(),
    samples: z.array(z.number()),
  });

  app.post('/audio/breathing', async (request, reply) => {
    const parsed = AudioSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const frame = {
      sampleRateHz: parsed.data.sampleRateHz,
      samples: Float32Array.from(parsed.data.samples),
    };
    const result = await breathing.analyze(frame);
    return reply.code(200).send(result);
  });

  app.post('/audio/distress', async (request, reply) => {
    const parsed = AudioSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const frame = {
      sampleRateHz: parsed.data.sampleRateHz,
      samples: Float32Array.from(parsed.data.samples),
    };
    const result = await distress.analyze(frame);
    return reply.code(200).send(result);
  });

  app.post('/audio/fatigue', async (request, reply) => {
    const parsed = AudioSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const frame = {
      sampleRateHz: parsed.data.sampleRateHz,
      samples: Float32Array.from(parsed.data.samples),
    };
    const result = await fatigue.analyze(frame);
    return reply.code(200).send(result);
  });

  const StepsSchema = z.object({
    accountId: z.number().int().positive(),
    startedAt: z.string(),
    endedAt: z.string(),
    samples: z.array(
      z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
        at: z.string(),
      }),
    ),
  });

  app.post('/steps/validate', async (request, reply) => {
    const parsed = StepsSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const samples = parsed.data.samples.map((s) => ({
      x: s.x,
      y: s.y,
      z: s.z,
      at: new Date(s.at),
    }));

    const startedAt = new Date(parsed.data.startedAt);
    const endedAt = new Date(parsed.data.endedAt);
    const windowMinutes = (endedAt.getTime() - startedAt.getTime()) / 60_000;

    const steps = countSteps({
      accountId: parsed.data.accountId,
      startedAt,
      endedAt,
      samples,
    });

    const verdict = evaluate(samples, steps, windowMinutes);

    return reply.code(200).send({ steps, windowMinutes, antiCheat: verdict });
  });

  const WellnessSchema = z.object({
    activeMinutes: z.number(),
    sleepMinutes: z.number(),
    averageHeartRateBpm: z.number(),
    stepCount: z.number(),
  });

  app.post('/wellness/vector', async (request, reply) => {
    const parsed = WellnessSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const vector = buildVector(parsed.data);
    return reply.code(200).send(vector);
  });

  const GoalSchema = z.object({
    accountId: z.number().int().positive(),
    dailyStepTarget: z.number().int().positive(),
    weeklyActiveMinutesTarget: z.number().int().positive(),
    stepsToday: z.number().int().nonnegative(),
    activeMinutesToday: z.number().int().nonnegative(),
  });

  app.post('/move-to-earn/progress', async (request, reply) => {
    const parsed = GoalSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }

    const goal: GoalDefinition = {
      accountId: parsed.data.accountId,
      dailyStepTarget: parsed.data.dailyStepTarget,
      weeklyActiveMinutesTarget: parsed.data.weeklyActiveMinutesTarget,
    };

    const progress = evaluateProgress(
      goal,
      parsed.data.stepsToday,
      parsed.data.activeMinutesToday,
    );

    const reward = computeReward({
      accountId: parsed.data.accountId,
      goalMet: progress.goalMet,
      stepsToday: parsed.data.stepsToday,
      activeMinutesToday: parsed.data.activeMinutesToday,
    });

    return reply.code(200).send({
      progress,
      reward: { tgdAmount: reward.tgdAmount.toString() },
    });
  });

  const shutdown = async (): Promise<void> => {
    await app.close();
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
