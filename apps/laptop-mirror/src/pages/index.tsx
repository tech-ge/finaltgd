import Link from 'next/link';
import React from 'react';

export default function Home(): React.ReactElement {
  return (
    <main style={{ minHeight: '100vh', padding: 32, background: '#0B0F1A', color: '#F5F7FB' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>TechGeo Mirror</h1>
      <p style={{ color: '#A7B1C4', marginBottom: 24 }}>
        View and post from your laptop. Transactions require the primary phone.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/scan" style={{ padding: '12px 20px', background: '#3B82F6', color: '#F5F7FB', borderRadius: 10 }}>
          Scan to pair
        </Link>
        <Link href="/view" style={{ padding: '12px 20px', border: '1px solid #232B3D', borderRadius: 10 }}>
          Open viewer
        </Link>
      </div>
    </main>
  );
}
