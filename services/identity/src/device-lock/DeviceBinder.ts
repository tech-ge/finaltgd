import type { Pool } from 'pg';

import { hashFingerprint, type DeviceSignals } from './FingerprintHasher.js';
import { OnePhoneOneAccount } from './OnePhoneOneAccount.js';

export class DeviceBinder {
  private readonly binding: OnePhoneOneAccount;

  constructor(private readonly pool: Pool, private readonly salt: string) {
    this.binding = new OnePhoneOneAccount(pool);
  }

  async register(accountId: number, signals: DeviceSignals): Promise<string> {
    const fingerprint = hashFingerprint(signals, this.salt);
    await this.binding.bind({ accountId, deviceFingerprint: fingerprint });
    return fingerprint;
  }

  async revoke(accountId: number, reason: string): Promise<void> {
    await this.binding.revoke(accountId, reason);
  }

  async isBound(accountId: number): Promise<boolean> {
    const { rows } = await this.pool.query(
      'SELECT 1 FROM device_bindings WHERE account_id = $1 AND revoked_at IS NULL LIMIT 1',
      [accountId],
    );
    return rows.length > 0;
  }
}
