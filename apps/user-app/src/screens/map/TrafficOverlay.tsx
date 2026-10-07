import React from 'react';
import { View } from 'react-native';

export interface TrafficOverlayProps {
  congestionScore: number;
}

export function TrafficOverlay({ congestionScore }: TrafficOverlayProps): React.ReactElement {
  const color =
    congestionScore > 0.7
      ? 'rgba(239,68,68,0.3)'
      : congestionScore > 0.4
        ? 'rgba(245,158,11,0.25)'
        : 'rgba(16,185,129,0.2)';
  return <View style={{ flex: 1, backgroundColor: color }} />;
}
