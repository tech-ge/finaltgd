export interface StopEvent {
  intersectionId: string;
  arrivedAt: Date;
  departedAt: Date;
}

export interface StopStats {
  intersectionId: string;
  averageStopSeconds: number;
  samples: number;
}

export function summarize(events: StopEvent[]): StopStats[] {
  const buckets = new Map<string, { totalSeconds: number; samples: number }>();

  for (const e of events) {
    const seconds = (e.departedAt.getTime() - e.arrivedAt.getTime()) / 1000;
    if (seconds <= 0 || seconds > 600) {
      continue;
    }
    const bucket = buckets.get(e.intersectionId) ?? { totalSeconds: 0, samples: 0 };
    bucket.totalSeconds += seconds;
    bucket.samples += 1;
    buckets.set(e.intersectionId, bucket);
  }

  return Array.from(buckets.entries()).map(([intersectionId, b]) => ({
    intersectionId,
    averageStopSeconds: b.samples > 0 ? b.totalSeconds / b.samples : 0,
    samples: b.samples,
  }));
}
