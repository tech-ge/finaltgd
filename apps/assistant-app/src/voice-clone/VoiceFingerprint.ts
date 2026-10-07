import { createHash } from 'expo-crypto';

export interface LocalVoiceSample {
  accountId: number;
  sampleRateHz: number;
  durationMs: number;
  pcmBase64: string;
}

export async function fingerprintLocal(sample: LocalVoiceSample): Promise<string> {
  if (sample.durationMs < 1500) {
    throw new Error('voice_sample_too_short');
  }
  const digest = await createHash('SHA-256', sample.pcmBase64);
  return digest;
}
