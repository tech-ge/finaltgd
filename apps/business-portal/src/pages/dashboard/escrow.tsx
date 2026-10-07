import React from 'react';

export default function EscrowPage(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Escrow</h1>
      <p className="text-gray-400 mb-6">
        Funds are held until GPS and biometric conditions match.
      </p>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p className="text-sm text-gray-500">No active escrows.</p>
      </div>
    </main>
  );
}
