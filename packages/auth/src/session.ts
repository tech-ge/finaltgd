export interface SessionRecord {
  jti: string;
  sub: string;
  role: string;
  orgId?: number;
  deviceFingerprint: string;
  issuedAt: number;
  expiresAt: number;
}

export interface SessionStore {
  put(session: SessionRecord): Promise<void>;
  get(jti: string): Promise<SessionRecord | null>;
  revoke(jti: string): Promise<void>;
}

export class MemorySessionStore implements SessionStore {
  private readonly sessions = new Map<string, SessionRecord>();

  async put(session: SessionRecord): Promise<void> {
    this.sessions.set(session.jti, session);
  }

  async get(jti: string): Promise<SessionRecord | null> {
    return this.sessions.get(jti) ?? null;
  }

  async revoke(jti: string): Promise<void> {
    this.sessions.delete(jti);
  }

  purgeExpired(now = Date.now()): void {
    for (const [jti, session] of this.sessions.entries()) {
      if (session.expiresAt <= now) {
        this.sessions.delete(jti);
      }
    }
  }
}
