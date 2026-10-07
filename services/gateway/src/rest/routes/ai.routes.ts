import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { requireResourceAction } from '../../auth/RbacGuard.js';
import type { ProxyClient } from '../versioning/proxy.js';

const InvokeSchema = z.object({
  accountId: z.number().int().positive(),
  intent: z.string().min(1),
  payload: z.record(z.unknown()),
});

export async function registerAiRoutes(
  app: FastifyInstance,
  proxy: ProxyClient,
): Promise<void> {
  app.post(
    '/v1/ai/invoke',
    { preHandler: requireResourceAction('ai', 'invoke') },
    async (request, reply) => {
      const parsed = InvokeSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
      }
      const result = await proxy.forward('ai-orchestrator', '/invoke', parsed.data);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/ai/context',
    { preHandler: requireResourceAction('ai', 'invoke') },
    async (request, reply) => {
      const result = await proxy.forward('ai-orchestrator', '/context/read', request.body);
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
