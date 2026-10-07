export interface TrafficEvent {
  businessId: number;
  lat: number;
  lon: number;
  observedAt: Date;
}

export interface GridCell {
  latBucket: number;
  lonBucket: number;
  count: number;
}

const BUCKET_SIZE = 0.001;

export function aggregate(events: TrafficEvent[]): GridCell[] {
  const buckets = new Map<string, GridCell>();

  for (const e of events) {
    const latBucket = Math.round(e.lat / BUCKET_SIZE) * BUCKET_SIZE;
    const lonBucket = Math.round(e.lon / BUCKET_SIZE) * BUCKET_SIZE;
    const key = `${latBucket}:${lonBucket}`;
    const existing = buckets.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      buckets.set(key, { latBucket, lonBucket, count: 1 });
    }
  }

  return Array.from(buckets.values());
}
