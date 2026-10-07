import type { Pool } from 'pg';

export interface VaultEntry {
  accountId: number;
  fingerprintHash: string;
  enrolledAt: Date;
}

export class VoiceVault {
  constructor(private readonly pool: Pool) {}

  async store(accountId: number, fingerprintHash: string): Promise<void> {
    const encrypted = Buffer.from(fingerprintHash, 'hex');
    await this.pool.query(
      `INSERT INTO voice_profiles (account_id, fingerprint_cipher, kms_key_id, is_active)
       VALUES ($1, $2, 'vault-default', TRUE)
       ON CONFLICT (account_id) DO UPDATE
         SET fingerprint_cipher = EXCLUDED.fingerprint_cipher,
             updated_at = CURRENT_TIMESTAMP,
             is_active = TRUE`,
      [accountId, encrypted],
    );
  }

  async load(accountId: number): Promise<VaultEntry | null> {
    const { rows } = await this.pool.query<{
      account_id: number;
      fingerprint_cipher: Buffer;
      enrolled_at: Date;
      is_active: boolean;
    }>(
      `SELECT account_id, fingerprint_cipher, enrolled_at, is_active
       FROM voice_profiles
       WHERE account_id = $1`,
      [accountId],
    );

    const row = rows[0];
    if (!row || !row.is_active) {
      return null;
    }

    return {
      accountId: row.account_id,
      fingerprintHash: row.fingerprint_cipher.toString('hex'),
      enrolledAt: row.enrolled_at,
    };
  }

  async revoke(accountId: number): Promise<void> {
    await this.pool.query(
      'UPDATE voice_profiles SET is_active = FALSE WHERE account_id = $1',
      [accountId],
    );
  }

  async assertOwnership(accountId: number, hash: string): Promise<void> {
    const entry = await this.load(accountId);
    if (!entry || entry.fingerprintHash !== hash) {
      throw new Error('voice_vault_ownership_denied');
    }
  }
}
