import type { PositionSample } from './VelocityCheck.js';
import { checkVelocity } from './VelocityCheck.js';

export interface MockGpsVerdict {
  flagged: boolean;
  reasons: string[];
}

export function detect(samples: PositionSample[]): MockGpsVerdict {
  const reasons: string[] = [];

  for (let i = 1; i < samples.length; i += 1) {
    const prev = samples[i - 1];
    const curr = samples[i];
    if (!prev || !curr) {
      continue;
    }
    const v = checkVelocity(prev, curr);
    if (v.impossible) {
      reasons.push('impossible_velocity');
    }
  }

  const unique = Array.from(new Set(reasons));
  return { flagged: unique.length > 0, reasons: unique };
}
