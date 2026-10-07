import type { Pool } from 'pg';

import { fingerprint, type VoiceSample } from './VoiceFingerprint.js';
import { VoiceVault } from './VoiceVault.js';

export interface EnrollmentInput {
  accountId: number;
  sample: VoiceSample;
}

export interface EnrollmentResult {
  fingerprintHash: string;
}

export class EnrollmentService {
  private readonly vault: VoiceVault;

  constructor(private readonly pool: Pool) {
    this.vault = new VoiceVault(pool);
  }

  async enroll(input: EnrollmentInput): Promise<EnrollmentResult> {
    const print = fingerprint(input.sample);
    await this.vault.store(input.accountId, print.hash);
    return { fingerprintHash: print.hash };
  }

  async revoke(accountId: number): Promise<void> {
    await this.vault.revoke(accountId);
  }
}
