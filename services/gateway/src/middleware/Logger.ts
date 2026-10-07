import type { FastifyInstance } from 'fastify';

export function registerLogger(app: FastifyInstance, level: string): void {
  app.log.level = level;

  app.addHook('onRequest', async (request) => {
    request.log.info(
      { method: request.method, url: request.url, ip: request.ip },
      'request_start',
    );
  });

  app.addHook('onResponse', async (request, reply) => {
    request.log.info(
      {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        elapsedMs: reply.elapsedTime,
      },
      'request_end',
    );
  });
}
