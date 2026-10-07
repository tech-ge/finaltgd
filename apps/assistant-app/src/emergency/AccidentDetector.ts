export interface MotionSample {
  gForce: number;
  at: number;
}

export interface AccidentVerdict {
  detected: boolean;
  peakG: number;
}

const IMPACT_G_THRESHOLD = 6.0;

export function detectAccident(samples: MotionSample[]): AccidentVerdict {
  const peakG = samples.reduce((max, s) => Math.max(max, s.gForce), 0);
  return { detected: peakG >= IMPACT_G_THRESHOLD, peakG };
}
