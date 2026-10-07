import type { Redis } from 'ioredis';

import type { SessionClaims } from './JwtVerifier.js';

const TTL_SECONDS = 7 * 24 * 60 * 60;

export interface SessionRecord {
  jti: string;
  claims: SessionClaims;
  issuedAt: number;
  expiresAt: number;
}

export class SessionStore {
  constructor(private readonly redis: Redis) {}

  private key(jti: string): string {
    return `session:${jti}`;
  }

  async put(jti: string, claims: SessionClaims): Promise<void> {
    const record: SessionRecord = {
      jti,
      claims,
      issuedAt: Date.now(),
      expiresAt: Date.now() + TTL_SECONDS * 1000,
    };
    await this.redis.set(this.key(jti), JSON.stringify(record), 'EX', TTL_SECONDS);
  }

  async get(jti: string): Promise<SessionRecord | null> {
    const raw = await this.redis.get(this.key(jti));
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as SessionRecord;
    } catch {
      return null;
    }
  }

  async revoke(jti: string): Promise<void> {
    await this.redis.del(this.key(jti));
  }

  async revokeAllForAccount(accountId: number): Promise<void> {
    const pattern = `session:*`;
    const stream = this.redis.scanStream({ match: pattern, count: 100 });
    for await (const keys of stream) {
      for (const key of keys as string[]) {
        const raw = await this.redis.get(key);
        if (!raw) {
          continue;
        }
        try {
          const record = JSON.parse(raw) as SessionRecord;
          if (record.claims.sub === String(accountId)) {
            await this.redis.del(key);
          }
        } catch {
          continue;
        }
      }
    }
  }
}
