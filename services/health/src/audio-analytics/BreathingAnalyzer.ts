import type { AudioFrame, OnDeviceModel } from './OnDeviceModel.js';

export interface BreathingResult {
  pattern: 'normal' | 'rapid' | 'labored' | 'unknown';
  confidence: number;
}

const MAP: Record<string, BreathingResult['pattern']> = {
  normal_breathing: 'normal',
  rapid_breathing: 'rapid',
  labored_breathing: 'labored',
};

export class BreathingAnalyzer {
  constructor(private readonly model: OnDeviceModel) {}

  async analyze(frame: AudioFrame): Promise<BreathingResult> {
    const { label, confidence } = await this.model.classify(frame);
    const pattern = MAP[label] ?? 'unknown';
    return { pattern, confidence };
  }
}
