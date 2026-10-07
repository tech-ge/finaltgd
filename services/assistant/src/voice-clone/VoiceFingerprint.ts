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

export function fingerprint(sample: VoiceSample): VoiceFingerprint {
  if (sample.pcmBytes.length === 0) {
    throw new Error('empty_voice_sample');
  }
  if (sample.durationMs < 1500) {
    throw new Error('voice_sample_too_short');
  }
  const hash = createHash('sha256').update(sample.pcmBytes).digest('hex');
  return {
    hash,
    sampleRateHz: sample.sampleRateHz,
    durationMs: sample.durationMs,
  };
}
