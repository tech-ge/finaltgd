import React from 'react';

export default function HeatmapsPage(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Heatmaps</h1>
      <p className="text-gray-400 mb-6">
        Foot traffic aggregated by grid cell and hour.
      </p>
      <div className="aspect-video bg-gray-900 border border-gray-800 rounded-2xl flex items-center justify-center">
        <p className="text-sm text-gray-500">No data yet.</p>
      </div>
    </main>
  );
}
