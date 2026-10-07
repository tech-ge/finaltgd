import type { FastifyInstance } from 'fastify';

import { requireResourceAction } from '../../auth/RbacGuard.js';
import type { ProxyClient } from '../versioning/proxy.js';

export async function registerHealthRoutes(
  app: FastifyInstance,
  proxy: ProxyClient,
): Promise<void> {
  app.post(
    '/v1/health/wellness',
    { preHandler: requireResourceAction('health', 'read') },
    async (request, reply) => {
      const result = await proxy.forward('health', '/wellness/vector', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/health/steps/validate',
    { preHandler: requireResourceAction('health', 'read') },
    async (request, reply) => {
      const result = await proxy.forward('health', '/steps/validate', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/health/move-to-earn',
    { preHandler: requireResourceAction('health', 'read') },
    async (request, reply) => {
      const result = await proxy.forward('health', '/move-to-earn/progress', request.body);
      return reply.code(result.status).send(result.body);
    },
  );
}
