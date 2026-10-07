import type { CandidateShortcut } from './ShortcutMiner.js';

export interface CustomRoad {
  id: string;
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  supportCount: number;
  status: 'candidate' | 'approved' | 'rejected';
}

export function toRoads(shortcuts: CandidateShortcut[]): CustomRoad[] {
  return shortcuts.map((s, idx) => ({
    id: `road-${idx + 1}`,
    startLat: s.startLat,
    startLon: s.startLon,
    endLat: s.endLat,
    endLon: s.endLon,
    supportCount: s.supportCount,
    status: 'candidate',
  }));
}
