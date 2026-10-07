import type { GyroscopeSample } from './GyroscopeReader.js';
import { isSleepStill } from './GyroscopeReader.js';

export interface SleepWindow {
  startedAt: Date;
  endedAt: Date;
  samples: GyroscopeSample[];
}

export interface SleepQualityResult {
  minutes: number;
  stillnessRatio: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

export function evaluateSleep(window: SleepWindow): SleepQualityResult {
  const minutes = Math.max(
    0,
    Math.round((window.endedAt.getTime() - window.startedAt.getTime()) / 60_000),
  );

  const chunk = 60;
  let stillChunks = 0;
  let totalChunks = 0;

  for (let i = 0; i < window.samples.length; i += chunk) {
    const slice = window.samples.slice(i, i + chunk);
    if (slice.length === 0) {
      continue;
    }
    totalChunks += 1;
    if (isSleepStill(slice)) {
      stillChunks += 1;
    }
  }

  const stillnessRatio = totalChunks > 0 ? stillChunks / totalChunks : 0;

  let quality: SleepQualityResult['quality'];
  if (stillnessRatio >= 0.85 && minutes >= 420) {
    quality = 'excellent';
  } else if (stillnessRatio >= 0.7 && minutes >= 360) {
    quality = 'good';
  } else if (stillnessRatio >= 0.5 && minutes >= 240) {
    quality = 'fair';
  } else {
    quality = 'poor';
  }

  return { minutes, stillnessRatio, quality };
}
