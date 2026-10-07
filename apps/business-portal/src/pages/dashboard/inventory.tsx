import React from 'react';

export default function InventoryPage(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Inventory</h1>
      <p className="text-gray-400 mb-6">
        Forecast demand and receive reorder recommendations.
      </p>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <p className="text-sm text-gray-500">No products in inventory.</p>
      </div>
    </main>
  );
}
