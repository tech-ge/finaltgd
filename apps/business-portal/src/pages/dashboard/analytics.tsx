import React from 'react';

export default function AnalyticsPage(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-400">Volume (30d)</p>
          <p className="text-2xl font-bold mt-2">0 TGD</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-400">Transfers</p>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-sm text-gray-400">Unique customers</p>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
      </div>
    </main>
  );
}
