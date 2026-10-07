import type { Pool } from 'pg';

import { hashFingerprint, type DeviceSignals, validateSignals } from './FingerprintHasher.js';
import { OnePhoneOneAccount } from './OnePhoneOneAccount.js';

export interface RegisterResult {
  fingerprint: string;
}

export class DeviceBinder {
  private readonly binding: OnePhoneOneAccount;

  constructor(private readonly pool: Pool, private readonly salt: string) {
    this.binding = new OnePhoneOneAccount(pool);
  }

  async register(accountId: number, signals: DeviceSignals): Promise<RegisterResult> {
    validateSignals(signals);
    const fingerprint = hashFingerprint(signals, this.salt);
    await this.binding.bind({ accountId, deviceFingerprint: fingerprint });
    return { fingerprint };
  }

  async revoke(accountId: number, reason: string): Promise<void> {
    await this.binding.revoke(accountId, reason);
  }

  async isBound(accountId: number): Promise<boolean> {
    return this.binding.isBound(accountId);
  }
}
