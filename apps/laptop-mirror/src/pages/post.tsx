import React from 'react';

export default function Post(): React.ReactElement {
  return (
    <main style={{ minHeight: '100vh', padding: 32, background: '#0B0F1A', color: '#F5F7FB' }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Post</h1>
      <p style={{ color: '#A7B1C4', marginBottom: 24 }}>
        Laptops can post messages. Transactions must originate on the phone.
      </p>
      <textarea
        placeholder="Type a message"
        rows={4}
        style={{
          width: '100%',
          padding: 12,
          background: '#121826',
          color: '#F5F7FB',
          border: '1px solid #232B3D',
          borderRadius: 10,
        }}
      />
    </main>
  );
}
