import type { PathPoint } from './PathLogger.js';

export interface CandidateShortcut {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  supportCount: number;
}

const GRID_DEGREES = 0.001;

function bucket(point: PathPoint): string {
  const lat = Math.round(point.lat / GRID_DEGREES);
  const lon = Math.round(point.lon / GRID_DEGREES);
  return `${lat}:${lon}`;
}

export function mineShortcuts(paths: PathPoint[][], minSupport = 3): CandidateShortcut[] {
  const pairs = new Map<string, { start: PathPoint; end: PathPoint; count: number }>();

  for (const path of paths) {
    if (path.length < 2) {
      continue;
    }
    const first = path[0];
    const last = path[path.length - 1];
    if (!first || !last) {
      continue;
    }
    const key = `${bucket(first)}->${bucket(last)}`;
    const existing = pairs.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      pairs.set(key, { start: first, end: last, count: 1 });
    }
  }

  return Array.from(pairs.values())
    .filter((p) => p.count >= minSupport)
    .map((p) => ({
      startLat: p.start.lat,
      startLon: p.start.lon,
      endLat: p.end.lat,
      endLon: p.end.lon,
      supportCount: p.count,
    }));
}
