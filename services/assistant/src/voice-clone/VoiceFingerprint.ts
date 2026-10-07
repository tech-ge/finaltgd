import { createHash } from 'node:crypto';

export interface VoiceSample {
  sampleRateHz: number;
  durationMs: number;
  pcmBytes: Buffer;
}

export interface VoiceFingerprint {
  hash: string;
  sampleRateHz: number;
  durationMs: number;
}

const MIN_DURATION_MS = 1_500;
const MAX_DURATION_MS = 120_000;

export function fingerprint(sample: VoiceSample): VoiceFingerprint {
  if (sample.pcmBytes.length === 0) {
    throw new Error('empty_voice_sample');
  }
  if (sample.durationMs < MIN_DURATION_MS) {
    throw new Error('voice_sample_too_short');
  }
  if (sample.durationMs > MAX_DURATION_MS) {
    throw new Error('voice_sample_too_long');
  }
  const hash = createHash('sha256').update(sample.pcmBytes).digest('hex');
  return {
    hash,
    sampleRateHz: sample.sampleRateHz,
    durationMs: sample.durationMs,
  };
}
