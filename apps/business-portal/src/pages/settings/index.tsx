import React from 'react';

export default function SettingsPage(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Business name</label>
          <input
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            placeholder="Business name"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <input
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            placeholder="Category"
          />
        </div>
      </div>
    </main>
  );
}
