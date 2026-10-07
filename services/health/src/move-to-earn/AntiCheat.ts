import type { AccelerometerSample } from '../sensor-fusion/AccelerometerReader.js';

export interface AntiCheatVerdict {
  allowed: boolean;
  reason?: string;
}

const IMPOSSIBLE_RATE = 300;
const MAX_JITTER = 25;

export function evaluate(
  samples: AccelerometerSample[],
  reportedSteps: number,
  windowMinutes: number,
): AntiCheatVerdict {
  if (windowMinutes <= 0) {
    return { allowed: false, reason: 'invalid_window' };
  }

  const rate = reportedSteps / windowMinutes;
  if (rate > IMPOSSIBLE_RATE) {
    return { allowed: false, reason: 'implausible_step_rate' };
  }

  let jitter = 0;
  for (let i = 1; i < samples.length; i += 1) {
    const prev = samples[i - 1];
    const curr = samples[i];
    if (!prev || !curr) {
      continue;
    }
    const delta =
      Math.abs(curr.x - prev.x) + Math.abs(curr.y - prev.y) + Math.abs(curr.z - prev.z);
    if (delta > MAX_JITTER) {
      jitter += 1;
    }
  }

  const jitterRatio = samples.length > 0 ? jitter / samples.length : 0;
  if (jitterRatio > 0.3) {
    return { allowed: false, reason: 'excessive_motion_jitter' };
  }

  return { allowed: true };
}
