import { jwtVerify, SignJWT, type JWTPayload } from 'jose';

export type Role = 'CEO' | 'ADMIN' | 'SUPERVISOR' | 'WORKER' | 'BUSINESS' | 'USER';

export interface SessionClaims extends JWTPayload {
  sub: string;
  role: Role;
  orgId?: number;
  deviceFingerprint: string;
}

export interface JwtConfig {
  secret: string;
  issuer?: string;
  audience?: string;
}

export class JwtVerifier {
  private readonly key: Uint8Array;
  private readonly config: JwtConfig;

  constructor(config: JwtConfig) {
    if (config.secret.length < 32) {
      throw new Error('jwt_secret_too_short');
    }
    this.key = new TextEncoder().encode(config.secret);
    this.config = config;
  }

  async sign(
    claims: Omit<SessionClaims, 'iat' | 'exp' | 'iss' | 'aud'>,
    expiresIn: string,
  ): Promise<string> {
    const builder = new SignJWT(claims as JWTPayload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime(expiresIn);

    if (this.config.issuer) {
      builder.setIssuer(this.config.issuer);
    }
    if (this.config.audience) {
      builder.setAudience(this.config.audience);
    }
    return builder.sign(this.key);
  }

  async verify(token: string): Promise<SessionClaims> {
    const { payload } = await jwtVerify(token, this.key, {
      algorithms: ['HS256'],
      issuer: this.config.issuer,
      audience: this.config.audience,
    });

    if (typeof payload.sub !== 'string' || typeof payload.role !== 'string') {
      throw new Error('invalid_claims');
    }
    if (typeof payload.deviceFingerprint !== 'string') {
      throw new Error('missing_device_fingerprint');
    }

    return payload as SessionClaims;
  }
}
