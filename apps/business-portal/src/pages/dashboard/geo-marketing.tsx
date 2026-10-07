import React from 'react';

export default function GeoMarketingPage(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Geo Marketing</h1>
      <p className="text-gray-400 mb-6">
        Campaigns activated when customers enter a defined radius.
      </p>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p className="text-sm text-gray-500">No campaigns yet.</p>
      </div>
    </main>
  );
}
