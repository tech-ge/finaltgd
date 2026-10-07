import type { AccelerometerSample } from '../sensor-fusion/AccelerometerReader.js';
import { isStepSpike } from '../sensor-fusion/AccelerometerReader.js';

export interface StepWindow {
  accountId: number;
  startedAt: Date;
  endedAt: Date;
  samples: AccelerometerSample[];
}

const MIN_STEP_INTERVAL_MS = 250;
const MAX_STEPS_PER_MINUTE = 220;

export function countSteps(window: StepWindow): number {
  let steps = 0;
  let lastStepAt = 0;

  for (let i = 1; i < window.samples.length; i += 1) {
    const prev = window.samples[i - 1];
    const curr = window.samples[i];
    if (!prev || !curr) {
      continue;
    }
    if (isStepSpike(prev, curr) && curr.at.getTime() - lastStepAt >= MIN_STEP_INTERVAL_MS) {
      steps += 1;
      lastStepAt = curr.at.getTime();
    }
  }

  const durationMinutes = (window.endedAt.getTime() - window.startedAt.getTime()) / 60_000;
  if (durationMinutes > 0) {
    const ratePerMinute = steps / durationMinutes;
    if (ratePerMinute > MAX_STEPS_PER_MINUTE) {
      return 0;
    }
  }

  return steps;
}
