import { z } from 'zod';

export const JwtSecretSchema = z
  .string()
  .min(32)
  .max(256)
  .refine((v) => /^[0-9a-fA-F]+$/.test(v) || v.length >= 32, {
    message: 'weak_jwt_secret',
  });

export const FingerprintSaltSchema = z
  .string()
  .min(32)
  .max(256);

export const HmacSecretSchema = z
  .string()
  .min(32)
  .max(256);

export interface ServiceSecrets {
  jwtSecret: string;
  deviceFingerprintSalt: string;
  hmacSecret: string;
}

export function loadSecrets(source: NodeJS.ProcessEnv): ServiceSecrets {
  const jwtSecret = JwtSecretSchema.parse(source.JWT_SECRET);
  const deviceFingerprintSalt = FingerprintSaltSchema.parse(source.DEVICE_FINGERPRINT_SALT);
  const hmacSecret = source.HMAC_SECRET ?? jwtSecret;
  return {
    jwtSecret,
    deviceFingerprintSalt,
    hmacSecret: HmacSecretSchema.parse(hmacSecret),
  };
}

export function assertNotPlaceholder(value: string, name: string): void {
  const markers = ['REPLACE', 'CHANGE', 'PLACEHOLDER', 'EXAMPLE', 'TEST'];
  const upper = value.toUpperCase();
  for (const marker of markers) {
    if (upper.includes(marker)) {
      throw new Error(`secret_looks_like_placeholder: ${name}`);
    }
  }
}
