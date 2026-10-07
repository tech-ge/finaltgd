import type { FastifyInstance } from 'fastify';

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
      const result = await proxy.forward('admin', '/hierarchy/admin', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/admin/hierarchy/supervisor',
    { preHandler: requireResourceAction('admin', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('admin', '/hierarchy/supervisor', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.post(
    '/v1/admin/hierarchy/worker',
    { preHandler: requireResourceAction('admin', 'manage') },
    async (request, reply) => {
      const result = await proxy.forward('admin', '/hierarchy/worker', request.body);
      return reply.code(result.status).send(result.body);
    },
  );

  app.get(
    '/v1/admin/live/:orgId',
    { preHandler: requireResourceAction('admin', 'read') },
    async (request, reply) => {
      const params = request.params as { orgId: string };
      const result = await proxy.forward('admin', `/live/${params.orgId}`, null, 'GET');
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
}
