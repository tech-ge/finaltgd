import type { AudioFrame, OnDeviceModel } from './OnDeviceModel.js';

export interface DistressResult {
  distressed: boolean;
  confidence: number;
}

const DISTRESS_LABELS = new Set(['voice_distress', 'voice_strain', 'pain_indicator']);

export class VoiceDistressDetector {
  constructor(private readonly model: OnDeviceModel) {}

  async analyze(frame: AudioFrame): Promise<DistressResult> {
    const { label, confidence } = await this.model.classify(frame);
    return {
      distressed: DISTRESS_LABELS.has(label) && confidence >= 0.6,
      confidence,
    };
  }
}
