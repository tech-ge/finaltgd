import Fastify from 'fastify';
import { Pool } from 'pg';
import { z } from 'zod';

import { DeviceBinder } from './device-lock/DeviceBinder.js';
import { NationalIdVerifier } from './kyc/NationalIdVerifier.js';
import { EncryptionVault } from './traceback/EncryptionVault.js';
import { TracebackService } from './traceback/TracebackService.js';

interface Env {
  NODE_ENV: string;
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  POSTGRES_URL: string;
  JWT_SECRET: string;
  DEVICE_FINGERPRINT_SALT: string;
  KMS_KEY_ID: string;
}

function loadEnv(): Env {
  const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SERVICE_NAME: z.string().default('identity'),
    PORT: z.coerce.number().int().positive().default(3003),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    POSTGRES_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32),
    DEVICE_FINGERPRINT_SALT: z.string().min(32),
    KMS_KEY_ID: z.string().min(1),
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
  const deviceBinder = new DeviceBinder(pool, env.DEVICE_FINGERPRINT_SALT);
  const vault = new EncryptionVault(env.JWT_SECRET, env.KMS_KEY_ID);
  const traceback = new TracebackService(pool, vault);
  const idVerifier = new NationalIdVerifier();

  const app = Fastify({ logger: { level: env.LOG_LEVEL } });

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/version', async () => ({
    service: env.SERVICE_NAME,
    version: '0.1.0',
    env: env.NODE_ENV,
  }));

  const BindSchema = z.object({
    accountId: z.number().int().positive(),
    hardwareId: z.string().min(1),
    osVersion: z.string().min(1),
    appInstallId: z.string().min(1),
    screenClass: z.string().min(1),
  });

  app.post('/device/bind', async (request, reply) => {
    const parsed = BindSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      const fingerprint = await deviceBinder.register(parsed.data.accountId, {
        hardwareId: parsed.data.hardwareId,
        osVersion: parsed.data.osVersion,
        appInstallId: parsed.data.appInstallId,
        screenClass: parsed.data.screenClass,
      });
      return reply.code(201).send({ fingerprint });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  app.post('/device/revoke', async (request, reply) => {
    const schema = z.object({
      accountId: z.number().int().positive(),
      reason: z.string().min(4),
    });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      await deviceBinder.revoke(parsed.data.accountId, parsed.data.reason);
      return reply.code(200).send({ revoked: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
  });

  const VerifySchema = z.object({
    number: z.string(),
    fullName: z.string(),
    dateOfBirth: z.string(),
  });

  app.post('/kyc/verify', async (request, reply) => {
    const parsed = VerifySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    const result = await idVerifier.verify(parsed.data);
    return reply.code(200).send(result);
  });

  const RegisterSchema = z.object({
    accountId: z.number().int().positive(),
    nationalId: z.string().min(4),
    nationality: z.string().min(2),
  });

  app.post('/traceback/register', async (request, reply) => {
    const parsed = RegisterSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
    }
    try {
      await traceback.register({
        accountId: parsed.data.accountId,
        nationalId: parsed.data.nationalId,
        nationality: parsed.data.nationality,
        kmsKeyId: env.KMS_KEY_ID,
      });
      return reply.code(201).send({ registered: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown_error';
      return reply.code(422).send({ error: message });
    }
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
