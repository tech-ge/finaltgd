import type { FastifyInstance } from 'fastify';

import { requireResourceAction } from '../../auth/RbacGuard.js';
import type { ProxyClient } from '../versioning/proxy.js';

export async function registerAssistantRoutes(
  app: FastifyInstance,
  proxy: ProxyClient,
): Promise<void> {
  app.post(
    '/v1/assistant/enroll-voice',
    { preHandler: requireResourceAction('assistant', 'invoke') },
    async (request, reply) => {
      const result = await proxy.forward('assistant', '/voice/enroll', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/assistant/synthesize',
    { preHandler: requireResourceAction('assistant', 'invoke') },
    async (request, reply) => {
      const result = await proxy.forward('assistant', '/voice/synthesize', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/assistant/emergency',
    { preHandler: requireResourceAction('assistant', 'invoke') },
    async (request, reply) => {
      const result = await proxy.forward('assistant', '/emergency/trigger', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/assistant/call/log',
    { preHandler: requireResourceAction('assistant', 'invoke') },
    async (request, reply) => {
      const result = await proxy.forward('assistant', '/call/log', request.body);
      return reply.code(result.status).send(result.body);
    },
  );
}
