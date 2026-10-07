import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { requireResourceAction } from '../../auth/RbacGuard.js';
import type { ProxyClient } from '../versioning/proxy.js';

export async function registerAdminRoutes(
  app: FastifyInstance,
  proxy: ProxyClient,
): Promise<void> {
  app.post(
    '/v1/admin/hierarchy/admin',
    { preHandler: requireResourceAction('admin', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('admin', '/hierarchy/admin', request.body, 'POST', {
        'x-actor-account-id': String(request.headers['x-actor-account-id'] ?? ''),
        'x-actor-org-id': String(request.headers['x-actor-org-id'] ?? ''),
        'x-actor-role': String(request.headers['x-actor-role'] ?? ''),
      });
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/admin/hierarchy/supervisor',
    { preHandler: requireResourceAction('admin', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('admin', '/hierarchy/supervisor', request.body, 'POST', {
        'x-actor-account-id': String(request.headers['x-actor-account-id'] ?? ''),
        'x-actor-org-id': String(request.headers['x-actor-org-id'] ?? ''),
        'x-actor-role': String(request.headers['x-actor-role'] ?? ''),
      });
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/admin/hierarchy/worker',
    { preHandler: requireResourceAction('admin', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('admin', '/hierarchy/worker', request.body, 'POST', {
        'x-actor-account-id': String(request.headers['x-actor-account-id'] ?? ''),
        'x-actor-org-id': String(request.headers['x-actor-org-id'] ?? ''),
        'x-actor-role': String(request.headers['x-actor-role'] ?? ''),
      });
      return reply.code(result.status).send(result.body);
    },
  );

  app.get(
    '/v1/admin/live/:orgId',
    { preHandler: requireResourceAction('admin', 'read') },
    async (request, reply) => {
      const params = z
        .object({ orgId: z.coerce.number().int().positive() })
        .safeParse(request.params);
      if (!params.success) {
        return reply.code(400).send({ error: 'invalid_request' });
      }
      const result = await proxy.forward('admin', `/live/${params.data.orgId}`, null, 'GET');
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/admin/fraud/alert',
    { preHandler: requireResourceAction('admin', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('admin', '/fraud/alert', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/admin/fraud/mock-gps',
    { preHandler: requireResourceAction('admin', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('admin', '/fraud/mock-gps', request.body);
      return reply.code(result.status).send(result.body);
    },
  );
}
