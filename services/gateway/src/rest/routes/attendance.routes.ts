import type { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { requireResourceAction } from '../../auth/RbacGuard.js';
import type { ProxyClient } from '../versioning/proxy.js';

const CheckInSchema = z.object({
  employeeId: z.number().int().positive(),
  orgId: z.number().int().positive(),
  observedLat: z.number(),
  observedLon: z.number(),
});

export async function registerAttendanceRoutes(
  app: FastifyInstance,
  proxy: ProxyClient,
): Promise<void> {
  app.post(
    '/v1/attendance/checkin',
    { preHandler: requireResourceAction('attendance', 'checkin') },
    async (request, reply) => {
      const parsed = CheckInSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'invalid_request', issues: parsed.error.issues });
      }
      const result = await proxy.forward('attendance', '/checkin', parsed.data, 'POST', {
        'x-forwarded-for': request.ip,
      });
      return reply.code(result.status).send(result.body);
    },
  );

  app.get(
    '/v1/attendance/presence/:orgId',
    { preHandler: requireResourceAction('attendance', 'monitor') },
    async (request, reply) => {
      const params = z
        .object({ orgId: z.coerce.number().int().positive() })
        .safeParse(request.params);
      if (!params.success) {
        return reply.code(400).send({ error: 'invalid_request' });
      }
      const result = await proxy.forward(
        'attendance',
        `/presence/${params.data.orgId}`,
        null,
        'GET',
      );
      return reply.code(result.status).send(result.body);
    },
  );
}
