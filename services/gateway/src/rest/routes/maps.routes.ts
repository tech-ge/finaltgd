import type { FastifyInstance } from 'fastify';

import type { ProxyClient } from '../versioning/proxy.js';

export async function registerMapsRoutes(
  app: FastifyInstance,
  proxy: ProxyClient,
): Promise<void> {
  app.post('/v1/maps/route', async (request, reply) => {
    const result = await proxy.forward('maps', '/route', request.body);
    return reply.code(result.status).send(result.body);
  });

  app.post('/v1/maps/traffic', async (request, reply) => {
    const result = await proxy.forward('maps', '/traffic/aggregate', request.body);
    return reply.code(result.status).send(result.body);
  });

  app.post('/v1/maps/weather', async (request, reply) => {
    const result = await proxy.forward('maps', '/weather/impact', request.body);
    return reply.code(result.status).send(result.body);
  });
}
