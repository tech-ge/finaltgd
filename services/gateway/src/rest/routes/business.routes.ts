import type { FastifyInstance } from 'fastify';

import { requireResourceAction } from '../../auth/RbacGuard.js';
import type { ProxyClient } from '../versioning/proxy.js';

export async function registerBusinessRoutes(
  app: FastifyInstance,
  proxy: ProxyClient,
): Promise<void> {
  app.post(
    '/v1/business/storefront',
    { preHandler: requireResourceAction('business', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('business', '/storefront', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/business/storefront/publish',
    { preHandler: requireResourceAction('business', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('business', '/storefront/publish', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.get(
    '/v1/business/storefront/:slug/products',
    { preHandler: requireResourceAction('business', 'read') },
    async (request, reply) => {
      const params = request.params as { slug: string };
      const result = await proxy.forward(
        'business',
        `/storefront/${params.slug}/products`,
        null,
        'GET',
      );
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/business/payment',
    { preHandler: requireResourceAction('business', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('business', '/payment/intent', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/business/heatmap',
    { preHandler: requireResourceAction('business', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('business', '/heatmap', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/business/settlement/net',
    { preHandler: requireResourceAction('business', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('business', '/settlement/net', request.body);
      return reply.code(result.status).send(result.body);
    },
  );
}
