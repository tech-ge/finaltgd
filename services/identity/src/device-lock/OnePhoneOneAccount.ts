import type { Pool } from 'pg';

export interface BindInput {
  accountId: number;
  deviceFingerprint: string;
}

export class OnePhoneOneAccount {
  constructor(private readonly pool: Pool) {}

  async bind(input: BindInput): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: existingAccount } = await client.query<{ account_id: number }>(
        'SELECT account_id FROM device_bindings WHERE account_id = $1 AND revoked_at IS NULL FOR UPDATE',
        [input.accountId],
      );

      if (existingAccount.length > 0) {
        throw new Error('account_already_bound_to_device');
      }

      const { rows: existingDevice } = await client.query<{ account_id: number }>(
        'SELECT account_id FROM device_bindings WHERE device_fingerprint = $1 AND revoked_at IS NULL FOR UPDATE',
        [input.deviceFingerprint],
      );

      if (existingDevice.length > 0) {
        throw new Error('device_already_bound_to_account');
      }

      await client.query(
        `INSERT INTO device_bindings (account_id, device_fingerprint)
         VALUES ($1, $2)`,
        [input.accountId, input.deviceFingerprint],
      );

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async revoke(accountId: number, reason: string): Promise<void> {
    await this.pool.query(
      `UPDATE device_bindings
       SET revoked_at = CURRENT_TIMESTAMP, revocation_reason = $2
       WHERE account_id = $1 AND revoked_at IS NULL`,
      [accountId, reason],
    );
  }
}
