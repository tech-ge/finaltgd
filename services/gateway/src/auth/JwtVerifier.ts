import { jwtVerify, SignJWT, type JWTPayload } from 'jose';

export interface SessionClaims extends JWTPayload {
  sub: string;
  role: 'CEO' | 'ADMIN' | 'SUPERVISOR' | 'WORKER' | 'BUSINESS' | 'USER';
  orgId?: number;
  deviceFingerprint: string;
}

export class JwtVerifier {
  private readonly key: Uint8Array;

  constructor(secret: string) {
    this.key = new TextEncoder().encode(secret);
  }

  async sign(claims: Omit<SessionClaims, 'iat' | 'exp'>, expiresIn: string): Promise<string> {
    return new SignJWT(claims as JWTPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(this.key);
  }

  async verify(token: string): Promise<SessionClaims> {
    const { payload } = await jwtVerify(token, this.key, { algorithms: ['HS256'] });
    if (typeof payload.sub !== 'string' || typeof payload.role !== 'string') {
      throw new Error('invalid_claims');
    }
    return payload as SessionClaims;
  }
}
