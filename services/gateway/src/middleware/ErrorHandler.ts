import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler(
    async (error: Error, request: FastifyRequest, reply: FastifyReply) => {
      request.log.error({ err: error, url: request.url }, 'request_error');
      const status =
        'statusCode' in error
          ? (error as { statusCode?: number }).statusCode ?? 500
          : 500;
      const message = status === 500 ? 'internal_server_error' : error.message;
      await reply.code(status).send({ error: message });
    },
  );

  app.setNotFoundHandler(async (_request: FastifyRequest, reply: FastifyReply) => {
    await reply.code(404).send({ error: 'not_found' });
  });
}
