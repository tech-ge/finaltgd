import websocket from '@fastify/websocket';
import Fastify from 'fastify';
import { Redis } from 'ioredis';
import { z } from 'zod';

import { JwtVerifier } from './auth/JwtVerifier.js';
import { SessionStore } from './auth/SessionStore.js';
import { registerErrorHandler } from './middleware/ErrorHandler.js';
import { registerCors } from './middleware/Cors.js';
import { registerHelmet } from './middleware/Helmet.js';
import { registerLogger } from './middleware/Logger.js';
import { RedisLimiter } from './rate-limit/RedisLimiter.js';
import { registerAdminRoutes } from './rest/routes/admin.routes.js';
import { registerAiRoutes } from './rest/routes/ai.routes.js';
import { registerAssistantRoutes } from './rest/routes/assistant.routes.js';
import { registerAttendanceRoutes } from './rest/routes/attendance.routes.js';
import { registerAuthRoutes } from './rest/routes/auth.routes.js';
import { registerBusinessRoutes } from './rest/routes/business.routes.js';
import { registerHealthRoutes } from './rest/routes/health.routes.js';
import { registerMapsRoutes } from './rest/routes/maps.routes.js';
import { registerWalletRoutes } from './rest/routes/wallet.routes.js';
import { registerV1 } from './rest/versioning/v1.js';
import { ProxyClient } from './rest/versioning/proxy.js';
import { AiEventStream } from './websocket/AiEventStream.js';
import { AttendanceStream } from './websocket/AttendanceStream.js';
import { GpsStream } from './websocket/GpsStream.js';
import { PaymentStream } from './websocket/PaymentStream.js';
import { RedisPubSub } from './websocket/RedisPubSub.js';
import { WsServer } from './websocket/WsServer.js';

interface Env {
  NODE_ENV: string;
  SERVICE_NAME: string;
  PORT: number;
  LOG_LEVEL: string;
  REDIS_LEDGER_URL: string;
  REDIS_CACHE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  DEVICE_FINGERPRINT_SALT: string;
  CURRENCY_SERVICE_URL: string;
  IDENTITY_SERVICE_URL: string;
  MAPS_SERVICE_URL: string;
  ATTENDANCE_SERVICE_URL: string;
  HEALTH_SERVICE_URL: string;
  BUSINESS_SERVICE_URL: string;
  ADMIN_SERVICE_URL: string;
  AI_ORCHESTRATOR_URL: string;
  ASSISTANT_URL: string;
}

function loadEnv(): Env {
  const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SERVICE_NAME: z.string().default('gateway'),
    PORT: z.coerce.number().int().positive().default(3000),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    REDIS_LEDGER_URL: z.string().min(1),
    REDIS_CACHE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('7d'),
    DEVICE_FINGERPRINT_SALT: z.string().min(32),
    CURRENCY_SERVICE_URL: z.string().url(),
    IDENTITY_SERVICE_URL: z.string().url(),
    MAPS_SERVICE_URL: z.string().url(),
    ATTENDANCE_SERVICE_URL: z.string().url(),
    HEALTH_SERVICE_URL: z.string().url(),
    BUSINESS_SERVICE_URL: z.string().url(),
    ADMIN_SERVICE_URL: z.string().url(),
    AI_ORCHESTRATOR_URL: z.string().url(),
    ASSISTANT_URL: z.string().url(),
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

  const ledgerRedis = new Redis(env.REDIS_LEDGER_URL);
  const cacheRedis = new Redis(env.REDIS_CACHE_URL);

  const jwt = new JwtVerifier(env.JWT_SECRET);
  const sessions = new SessionStore(cacheRedis);
  const limiter = new RedisLimiter(ledgerRedis);

  void limiter;

  const pubsub = new RedisPubSub(cacheRedis);

  const proxy = new ProxyClient({
    currency: env.CURRENCY_SERVICE_URL,
    identity: env.IDENTITY_SERVICE_URL,
    maps: env.MAPS_SERVICE_URL,
    attendance: env.ATTENDANCE_SERVICE_URL,
    health: env.HEALTH_SERVICE_URL,
    business: env.BUSINESS_SERVICE_URL,
    admin: env.ADMIN_SERVICE_URL,
    'ai-orchestrator': env.AI_ORCHESTRATOR_URL,
    assistant: env.ASSISTANT_URL,
  });

  const paymentStream = new PaymentStream(pubsub);
  const gpsStream = new GpsStream(pubsub);
  const attendanceStream = new AttendanceStream(pubsub);
  const aiEventStream = new AiEventStream(pubsub);

  void paymentStream;
  void gpsStream;
  void attendanceStream;
  void aiEventStream;

  const app = Fastify({ logger: { level: env.LOG_LEVEL }, trustProxy: true });

  registerLogger(app, env.LOG_LEVEL);
  await registerHelmet(app);
  await registerCors(app);
  await app.register(websocket);
  registerErrorHandler(app);
  await registerV1(app);

  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/version', async () => ({
    service: env.SERVICE_NAME,
    version: '0.1.0',
    env: env.NODE_ENV,
  }));

  await registerAuthRoutes(app, {
    jwt,
    sessions,
    fingerprintSalt: env.DEVICE_FINGERPRINT_SALT,
    expiresIn: env.JWT_EXPIRES_IN,
  });

  await registerWalletRoutes(app, proxy);
  await registerMapsRoutes(app, proxy);
  await registerAttendanceRoutes(app, proxy);
  await registerAiRoutes(app, proxy);
  await registerAssistantRoutes(app, proxy);
  await registerHealthRoutes(app, proxy);
  await registerBusinessRoutes(app, proxy);
  await registerAdminRoutes(app, proxy);

  const ws = new WsServer(jwt, pubsub);
  await ws.attach(app);

  const shutdown = async (): Promise<void> => {
    await pubsub.close();
    await app.close();
    await cacheRedis.quit();
    await ledgerRedis.quit();
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
