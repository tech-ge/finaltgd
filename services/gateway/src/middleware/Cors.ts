import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

const DEFAULT_ALLOWED = [
  'https://techgeo.app',
  'https://admin.techgeo.app',
  'https://business.techgeo.app',
  'https://mirror.techgeo.app',
];

export async function registerCors(
  app: FastifyInstance,
  extraOrigins: string[] = [],
): Promise<void> {
  const allowed = new Set([...DEFAULT_ALLOWED, ...extraOrigins]);

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) {
        cb(null, true);
        return;
      }
      if (allowed.has(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error('origin_not_allowed'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 600,
  });
}
