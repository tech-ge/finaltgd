import React from 'react';

export interface ReadOnlyGuardProps {
  children: React.ReactNode;
}

export function ReadOnlyGuard({ children }: ReadOnlyGuardProps): React.ReactElement {
  return (
    <div>
      <div
        style={{
          padding: '8px 12px',
          background: '#F59E0B',
          color: '#0B0F1A',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        Read only. Transactions require the primary phone.
      </div>
      {children}
    </div>
  );
}
