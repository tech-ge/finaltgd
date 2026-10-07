import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';

const IV_BYTES = 12;
const KEY_BYTES = 32;

export interface EncryptedPayload {
  ciphertext: Buffer;
  iv: Buffer;
  keyId: string;
}

export class EncryptionVault {
  private readonly keys = new Map<string, Buffer>();

  constructor(masterKey: string, keyId: string) {
    const derived = scryptSync(masterKey, keyId, KEY_BYTES);
    this.keys.set(keyId, derived);
  }

  encrypt(plaintext: string, keyId: string): EncryptedPayload {
    const key = this.keys.get(keyId);
    if (!key) {
      throw new Error(`unknown_key_id: ${keyId}`);
    }
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return { ciphertext: Buffer.concat([ciphertext, tag]), iv, keyId };
  }

  decrypt(payload: EncryptedPayload): string {
    const key = this.keys.get(payload.keyId);
    if (!key) {
      throw new Error(`unknown_key_id: ${payload.keyId}`);
    }
    const tag = payload.ciphertext.subarray(payload.ciphertext.length - 16);
    const data = payload.ciphertext.subarray(0, payload.ciphertext.length - 16);
    const decipher = createDecipheriv('aes-256-gcm', key, payload.iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  }
}
