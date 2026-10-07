import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'node:crypto';

const IV_BYTES = 12;
const KEY_BYTES = 32;
const TAG_BYTES = 16;

export interface EncryptedPayload {
  ciphertext: Buffer;
  iv: Buffer;
  keyId: string;
}

export class EncryptionVault {
  private readonly keys = new Map<string, Buffer>();

  constructor(masterKey: string, keyId: string) {
    if (masterKey.length < 32) {
      throw new Error('master_key_too_short');
    }
    const derived = scryptSync(masterKey, keyId, KEY_BYTES);
    this.keys.set(keyId, derived);
  }

  addKey(masterKey: string, keyId: string): void {
    if (masterKey.length < 32) {
      throw new Error('master_key_too_short');
    }
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
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
      cipher.getAuthTag(),
    ]);
    return { ciphertext, iv, keyId };
  }

  decrypt(payload: EncryptedPayload): string {
    const key = this.keys.get(payload.keyId);
    if (!key) {
      throw new Error(`unknown_key_id: ${payload.keyId}`);
    }
    if (payload.ciphertext.length < TAG_BYTES) {
      throw new Error('ciphertext_too_short');
    }
    const tag = payload.ciphertext.subarray(payload.ciphertext.length - TAG_BYTES);
    const data = payload.ciphertext.subarray(0, payload.ciphertext.length - TAG_BYTES);
    const decipher = createDecipheriv('aes-256-gcm', key, payload.iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  }
}
