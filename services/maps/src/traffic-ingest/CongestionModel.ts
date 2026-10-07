import type { SegmentSpeed } from './CrowdSpeedAggregator.js';

export interface CongestionReport {
  segmentId: string;
  level: 'free' | 'light' | 'moderate' | 'heavy' | 'severe';
  speedMps: number;
}

const FREE_MPS = 13.9;
const LIGHT_MPS = 10.0;
const MODERATE_MPS = 6.0;
const HEAVY_MPS = 2.5;

export function classify(segment: SegmentSpeed): CongestionReport {
  const s = segment.weightedSpeedMps;
  let level: CongestionReport['level'];
  if (s >= FREE_MPS) {
    level = 'free';
  } else if (s >= LIGHT_MPS) {
    level = 'light';
  } else if (s >= MODERATE_MPS) {
    level = 'moderate';
  } else if (s >= HEAVY_MPS) {
    level = 'heavy';
  } else {
    level = 'severe';
  }
  return { segmentId: segment.segmentId, level, speedMps: s };
}

export function classifyMany(segments: SegmentSpeed[]): CongestionReport[] {
  return segments.map(classify);
}
