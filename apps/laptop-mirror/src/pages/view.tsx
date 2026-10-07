import React from 'react';

import { SessionBridge } from '../components/SessionBridge';
import { ReadOnlyGuard } from '../components/ReadOnlyGuard';

export default function View(): React.ReactElement {
  return (
    <main style={{ minHeight: '100vh', padding: 32, background: '#0B0F1A', color: '#F5F7FB' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Live session</h1>
      <ReadOnlyGuard>
        <SessionBridge sessionId={null} />
      </ReadOnlyGuard>
    </main>
  );
}
