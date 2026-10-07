import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

const ALLOWED_ORIGINS = [
  'https://techgeo.app',
  'https://admin.techgeo.app',
  'https://business.techgeo.app',
  'https://mirror.techgeo.app',
];

export async function registerCors(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
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
