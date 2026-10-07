import React from 'react';

import { LiveMap } from '../../components/LiveMap/LiveMap';

export default function MapView(): React.ReactElement {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold mb-6">Live map</h1>
      <LiveMap workers={[]} />
    </main>
  );
}
