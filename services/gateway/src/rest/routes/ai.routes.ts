import type { FastifyInstance } from 'fastify';

import { requireResourceAction } from '../../auth/RbacGuard.js';
import type { ProxyClient } from '../versioning/proxy.js';

export async function registerAiRoutes(
  app: FastifyInstance,
  proxy: ProxyClient,
): Promise<void> {
  app.post(
    '/v1/ai/invoke',
    { preHandler: requireResourceAction('ai', 'invoke') },
    async (request, reply) => {
      const result = await proxy.forward('ai-orchestrator', '/invoke', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/ai/agent-to-agent',
    { preHandler: requireResourceAction('ai', 'invoke') },
    async (request, reply) => {
      const result = await proxy.forward('ai-orchestrator', '/agent-to-agent', request.body);
      return reply.code(result.status).send(result.body);
    },
  );
}
