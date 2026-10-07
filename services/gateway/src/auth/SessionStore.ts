import type { Redis } from 'ioredis';

import type { SessionClaims } from './JwtVerifier.js';

const TTL_SECONDS = 7 * 24 * 60 * 60;

export class SessionStore {
  constructor(private readonly redis: Redis) {}

  private key(jti: string): string {
    return `session:${jti}`;
  }

  async put(jti: string, claims: SessionClaims): Promise<void> {
    await this.redis.set(this.key(jti), JSON.stringify(claims), 'EX', TTL_SECONDS);
  }

  async get(jti: string): Promise<SessionClaims | null> {
    const raw = await this.redis.get(this.key(jti));
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as SessionClaims;
    } catch {
      return null;
    }
  }

  async revoke(jti: string): Promise<void> {
    await this.redis.del(this.key(jti));
  }
}
