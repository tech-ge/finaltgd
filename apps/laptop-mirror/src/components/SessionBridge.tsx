import React from 'react';

export interface SessionBridgeProps {
  sessionId: string | null;
}

export function SessionBridge({ sessionId }: SessionBridgeProps): React.ReactElement {
  return (
    <div
      style={{
        padding: 16,
        background: '#121826',
        border: '1px solid #232B3D',
        borderRadius: 12,
        color: '#A7B1C4',
      }}
    >
      {sessionId ? `Session: ${sessionId}` : 'No active session.'}
    </div>
  );
}
