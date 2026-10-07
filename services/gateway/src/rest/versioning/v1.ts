import type { FastifyInstance } from 'fastify';

const UNVERSIONED_ALLOW = new Set(['/health', '/version']);

export async function registerV1(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', async (request, reply) => {
    if (UNVERSIONED_ALLOW.has(request.url)) {
      return;
    }
    if (request.url.startsWith('/ws/')) {
      return;
    }
    if (request.url.startsWith('/v1/')) {
      return;
    }
    await reply.code(404).send({ error: 'use_v1_prefix' });
  });
}
