import React from 'react';

export default function IpVerification(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">IP verification</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p className="text-sm text-gray-500">
          Workers must match the corporate gateway before geofence check.
        </p>
      </div>
    </main>
  );
}
