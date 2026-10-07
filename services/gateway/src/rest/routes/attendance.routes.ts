import type { FastifyInstance } from 'fastify';

import { requireResourceAction } from '../../auth/RbacGuard.js';
import type { ProxyClient } from '../versioning/proxy.js';

export async function registerAttendanceRoutes(
  app: FastifyInstance,
  proxy: ProxyClient,
): Promise<void> {
  app.post(
    '/v1/attendance/checkin',
    { preHandler: requireResourceAction('attendance', 'checkin') },
    async (request, reply) => {
      const result = await proxy.forward('attendance', '/checkin', request.body, 'POST', {
        'x-forwarded-for': request.ip,
      });
      return reply.code(result.status).send(result.body);
    },
  );

  app.get(
    '/v1/attendance/presence/:orgId',
    { preHandler: requireResourceAction('attendance', 'monitor') },
    async (request, reply) => {
      const params = request.params as { orgId: string };
      const result = await proxy.forward('attendance', `/presence/${params.orgId}`, null, 'GET');
      return reply.code(result.status).send(result.body);
    },
  );
}
