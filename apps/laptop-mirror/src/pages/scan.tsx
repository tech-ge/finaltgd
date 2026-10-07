import React from 'react';

import { QrScanner } from '../components/QrScanner';

export default function Scan(): React.ReactElement {
  return (
    <main style={{ minHeight: '100vh', padding: 32, background: '#0B0F1A', color: '#F5F7FB' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Pair with phone</h1>
      <p style={{ color: '#A7B1C4', marginBottom: 24 }}>
        Scan the QR shown on your phone. Pairing is session-scoped.
      </p>
      <QrScanner onScanned={() => undefined} />
    </main>
  );
}
