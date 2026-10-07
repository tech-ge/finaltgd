import type { GridCell } from './FootTrafficAggregator.js';

export interface HeatmapGrid {
  cells: Array<GridCell & { intensity: number }>;
  maxCount: number;
}

export function generate(cells: GridCell[]): HeatmapGrid {
  const maxCount = cells.reduce((max, c) => Math.max(max, c.count), 0);
  if (maxCount === 0) {
    return { cells: [], maxCount: 0 };
  }

  return {
    maxCount,
    cells: cells.map((c) => ({
      ...c,
      intensity: Number((c.count / maxCount).toFixed(4)),
    })),
  };
}
