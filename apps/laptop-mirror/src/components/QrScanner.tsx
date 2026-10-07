import React from 'react';

export interface QrScannerProps {
  onScanned: (value: string) => void;
}

export function QrScanner({ onScanned }: QrScannerProps): React.ReactElement {
  void onScanned;
  return (
    <div
      style={{
        aspectRatio: 1,
        maxWidth: 380,
        background: '#121826',
        border: '1px solid #232B3D',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6F7B92',
      }}
    >
      Point camera at the QR shown on your phone
    </div>
  );
}
