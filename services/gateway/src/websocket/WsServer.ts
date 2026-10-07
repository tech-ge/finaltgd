import type { FastifyInstance } from 'fastify';
import type { WebSocket } from 'ws';

import type { JwtVerifier } from '../auth/JwtVerifier.js';
import type { RedisPubSub } from './RedisPubSub.js';

interface Connection {
  socket: WebSocket;
  accountId: number;
  orgId: number;
  role: string;
}

export class WsServer {
  private readonly connections = new Set<Connection>();

  constructor(private readonly jwt: JwtVerifier, private readonly pubsub: RedisPubSub) {}

  async attach(app: FastifyInstance): Promise<void> {
    app.get('/ws/stream', { websocket: true }, async (socket, request) => {
      const token = (request.query as { token?: string }).token;
      if (!token) {
        socket.close(4001, 'token_missing');
        return;
      }

      try {
        const claims = await this.jwt.verify(token);
        const conn: Connection = {
          socket,
          accountId: Number.parseInt(claims.sub, 10),
          orgId: claims.orgId ?? 0,
          role: claims.role,
        };
        this.connections.add(conn);

        const channels = [
          `payments.pending.${conn.accountId}`,
          `payments.settled.${conn.accountId}`,
          `gps.live.${conn.orgId}`,
          `attendance.event.${conn.orgId}`,
          `ai.event.${conn.accountId}`,
          `fraud.alert.${conn.orgId}`,
        ];

        for (const channel of channels) {
          await this.pubsub.subscribe(channel, (_ch, payload) => {
            if (socket.readyState === 1) {
              socket.send(payload);
            }
          });
        }

        socket.on('close', () => {
          this.connections.delete(conn);
        });
      } catch {
        socket.close(4003, 'invalid_token');
      }
    });
  }

  broadcast(channel: string, payload: unknown): void {
    const serialized = JSON.stringify({ channel, payload });
    for (const conn of this.connections) {
      try {
        if (conn.socket.readyState === 1) {
          conn.socket.send(serialized);
        }
      } catch {
        this.connections.delete(conn);
      }
    }
  }
}
