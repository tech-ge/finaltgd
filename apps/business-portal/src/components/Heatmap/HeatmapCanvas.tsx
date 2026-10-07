import React from 'react';

export interface HeatmapCell {
  latBucket: number;
  lonBucket: number;
  count: number;
  intensity: number;
}

export interface HeatmapCanvasProps {
  cells: HeatmapCell[];
}

export function HeatmapCanvas({ cells }: HeatmapCanvasProps): React.ReactElement {
  return (
    <div className="grid grid-cols-20 gap-px bg-gray-900 border border-gray-800 rounded-xl p-2">
      {cells.map((cell, idx) => (
        <div
          key={idx}
          className="aspect-square"
          style={{
            backgroundColor: `rgba(59,130,246,${cell.intensity})`,
          }}
        />
      ))}
    </div>
  );
}
