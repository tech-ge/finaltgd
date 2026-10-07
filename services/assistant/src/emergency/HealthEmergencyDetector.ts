export interface VitalsSample {
  heartRateBpm: number;
  at: Date;
}

export interface HealthEmergencyVerdict {
  detected: boolean;
  reason: string;
}

const EXTREME_LOW_BPM = 35;
const EXTREME_HIGH_BPM = 180;

export function detect(samples: VitalsSample[]): HealthEmergencyVerdict {
  for (const s of samples) {
    if (s.heartRateBpm > 0 && s.heartRateBpm < EXTREME_LOW_BPM) {
      return { detected: true, reason: 'extreme_bradycardia' };
    }
    if (s.heartRateBpm > EXTREME_HIGH_BPM) {
      return { detected: true, reason: 'extreme_tachycardia' };
    }
  }
  return { detected: false, reason: 'normal' };
}
