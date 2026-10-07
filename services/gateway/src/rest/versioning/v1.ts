import type { FastifyInstance } from 'fastify';

export async function registerV1(app: FastifyInstance): Promise<void> {
  app.addHook('onRequest', async (request, reply) => {
    if (request.url.startsWith('/v1/')) {
      return;
    }
    if (
      request.url === '/health' ||
      request.url === '/version' ||
      request.url.startsWith('/ws/')
    ) {
      return;
    }
    await reply.code(404).send({ error: 'use_v1_prefix' });
  });
}
