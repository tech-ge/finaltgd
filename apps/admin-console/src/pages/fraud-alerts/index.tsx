import React from 'react';

export default function FraudAlerts(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Fraud alerts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">Mock GPS</h2>
          <p className="text-sm text-gray-400">
            Sudden position jumps incompatible with human travel.
          </p>
        </div>
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">IP mismatch</h2>
          <p className="text-sm text-gray-400">
            Presence attempts from outside the corporate gateway.
          </p>
        </div>
      </div>
    </main>
  );
}
