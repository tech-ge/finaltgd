export interface SpeedSample {
  segmentId: string;
  speedMps: number;
  observedAt: Date;
  weight: number;
}

export interface SegmentSpeed {
  segmentId: string;
  weightedSpeedMps: number;
  sampleCount: number;
}

export function aggregate(samples: SpeedSample[]): SegmentSpeed[] {
  const buckets = new Map<string, { sum: number; weights: number; count: number }>();

  for (const s of samples) {
    if (s.speedMps < 0 || s.weight <= 0) {
      continue;
    }
    const bucket = buckets.get(s.segmentId) ?? { sum: 0, weights: 0, count: 0 };
    bucket.sum += s.speedMps * s.weight;
    bucket.weights += s.weight;
    bucket.count += 1;
    buckets.set(s.segmentId, bucket);
  }

  return Array.from(buckets.entries()).map(([segmentId, b]) => ({
    segmentId,
    weightedSpeedMps: b.weights > 0 ? b.sum / b.weights : 0,
    sampleCount: b.count,
  }));
}
