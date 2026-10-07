import Link from 'next/link';
import React from 'react';

export default function LiveMonitor(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Live monitor</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/live-monitor/map-view"
          className="block p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500"
        >
          <h2 className="text-lg font-semibold mb-2">Map view</h2>
          <p className="text-sm text-gray-400">Worker positions in real time</p>
        </Link>
        <Link
          href="/live-monitor/attendance-feed"
          className="block p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500"
        >
          <h2 className="text-lg font-semibold mb-2">Attendance feed</h2>
          <p className="text-sm text-gray-400">Event stream</p>
        </Link>
        <Link
          href="/live-monitor/ip-verification"
          className="block p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500"
        >
          <h2 className="text-lg font-semibold mb-2">IP verification</h2>
          <p className="text-sm text-gray-400">Corporate gateway matches</p>
        </Link>
      </div>
    </main>
  );
}
