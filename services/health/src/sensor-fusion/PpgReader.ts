export interface PpgSample {
  intensity: number;
  at: Date;
}

export interface HeartRateEstimate {
  bpm: number;
  confidence: number;
}

export function estimateHeartRate(samples: PpgSample[]): HeartRateEstimate {
  if (samples.length < 8) {
    return { bpm: 0, confidence: 0 };
  }

  const sorted = [...samples].sort((a, b) => a.at.getTime() - b.at.getTime());
  let peaks = 0;
  let lastPeakAt = 0;

  for (let i = 1; i < sorted.length - 1; i += 1) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const next = sorted[i + 1];
    if (!prev || !curr || !next) {
      continue;
    }
    if (curr.intensity > prev.intensity && curr.intensity > next.intensity) {
      if (lastPeakAt === 0 || curr.at.getTime() - lastPeakAt > 300) {
        peaks += 1;
        lastPeakAt = curr.at.getTime();
      }
    }
  }

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) {
    return { bpm: 0, confidence: 0 };
  }

  const durationSeconds = (last.at.getTime() - first.at.getTime()) / 1000;
  if (durationSeconds <= 0) {
    return { bpm: 0, confidence: 0 };
  }

  const bpm = (peaks / durationSeconds) * 60;
  return {
    bpm: Math.round(bpm),
    confidence: Math.min(1, durationSeconds / 30),
  };
}
