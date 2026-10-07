import type { AudioFrame, OnDeviceModel } from './OnDeviceModel.js';

export interface FatigueResult {
  fatigued: boolean;
  confidence: number;
}

const FATIGUE_LABELS = new Set(['fatigue', 'slurred_speech', 'low_energy_voice']);

export class FatigueIndicator {
  constructor(private readonly model: OnDeviceModel) {}

  async analyze(frame: AudioFrame): Promise<FatigueResult> {
    const { label, confidence } = await this.model.classify(frame);
    return {
      fatigued: FATIGUE_LABELS.has(label) && confidence >= 0.6,
      confidence,
    };
  }
}
