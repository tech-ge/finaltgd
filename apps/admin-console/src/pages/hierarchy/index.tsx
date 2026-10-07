import Link from 'next/link';
import React from 'react';

export default function HierarchyIndex(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Hierarchy</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/hierarchy/create-admin"
          className="block p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500"
        >
          <h2 className="text-lg font-semibold mb-2">Create Admin</h2>
          <p className="text-sm text-gray-400">CEO only</p>
        </Link>
        <Link
          href="/hierarchy/create-supervisor"
          className="block p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500"
        >
          <h2 className="text-lg font-semibold mb-2">Create Supervisor</h2>
          <p className="text-sm text-gray-400">Admin or CEO</p>
        </Link>
        <Link
          href="/hierarchy/create-worker"
          className="block p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500"
        >
          <h2 className="text-lg font-semibold mb-2">Create Worker</h2>
          <p className="text-sm text-gray-400">Supervisor or higher</p>
        </Link>
      </div>
    </main>
  );
}
