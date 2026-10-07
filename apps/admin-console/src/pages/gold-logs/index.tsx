import React from 'react';

export default function GoldLogs(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Gold logs</h1>
      <p className="text-gray-400 mb-6">
        High quality events used for Shadow Student training.
      </p>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p className="text-sm text-gray-500">No logs in queue.</p>
      </div>
    </main>
  );
}
