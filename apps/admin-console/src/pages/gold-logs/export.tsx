import React from 'react';

export default function GoldLogsExport(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Export gold logs</h1>
      <div className="max-w-lg space-y-3">
        <label className="block text-sm text-gray-400">Since (ISO)</label>
        <input
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          placeholder="2026-01-01T00:00:00Z"
        />
        <label className="block text-sm text-gray-400">Minimum score</label>
        <input
          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          placeholder="0.7"
        />
        <button className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold">
          Export
        </button>
      </div>
    </main>
  );
}
