import type { VoiceVault } from './VoiceVault.js';

export interface DailySample {
  accountId: number;
  deltaHash: string;
}

export class DailyLearner {
  constructor(private readonly vault: VoiceVault) {}

  async process(sample: DailySample): Promise<void> {
    const entry = await this.vault.load(sample.accountId);
    if (!entry) {
      throw new Error('voice_not_enrolled');
    }
    await this.vault.store(sample.accountId, sample.deltaHash);
  }
}
