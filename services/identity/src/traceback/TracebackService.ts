import type { Pool } from 'pg';

import { DisputeAccess } from './DisputeAccess.js';
import { EncryptionVault } from './EncryptionVault.js';

export interface RegisterIdentityInput {
  accountId: number;
  nationalId: string;
  nationality: string;
  kmsKeyId: string;
}

export class TracebackService {
  private readonly disputes: DisputeAccess;

  constructor(private readonly pool: Pool, private readonly vault: EncryptionVault) {
    this.disputes = new DisputeAccess(pool);
  }

  async register(input: RegisterIdentityInput): Promise<void> {
    const idCipher = this.vault.encrypt(input.nationalId, input.kmsKeyId);
    const nationalityCipher = this.vault.encrypt(input.nationality, input.kmsKeyId);

    await this.pool.query(
      `INSERT INTO identity_traceback
         (account_id, national_id_cipher, nationality_cipher, kms_key_id, verified_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (account_id) DO UPDATE
         SET national_id_cipher = EXCLUDED.national_id_cipher,
             nationality_cipher = EXCLUDED.nationality_cipher,
             kms_key_id = EXCLUDED.kms_key_id,
             verified_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP`,
      [input.accountId, idCipher.ciphertext, nationalityCipher.ciphertext, input.kmsKeyId],
    );
  }

  async read(
    accountId: number,
    dispute: { disputeId: number; actorAccount: number },
  ): Promise<{ nationalId: string; nationality: string }> {
    await this.disputes.logAccess(dispute.disputeId, dispute.actorAccount, accountId);

    const { rows } = await this.pool.query<{
      national_id_cipher: Buffer;
      nationality_cipher: Buffer;
      kms_key_id: string;
    }>(
      `SELECT national_id_cipher, nationality_cipher, kms_key_id
       FROM identity_traceback
       WHERE account_id = $1`,
      [accountId],
    );

    const row = rows[0];
    if (!row) {
      throw new Error('identity_not_found');
    }

    const nationalId = this.vault.decrypt({
      ciphertext: row.national_id_cipher,
      iv: Buffer.alloc(12, 0),
      keyId: row.kms_key_id,
    });
    const nationality = this.vault.decrypt({
      ciphertext: row.nationality_cipher,
      iv: Buffer.alloc(12, 0),
      keyId: row.kms_key_id,
    });

    return { nationalId, nationality };
  }
}
