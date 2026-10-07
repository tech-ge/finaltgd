import React from 'react';
import { View } from 'react-native';

export function Waveform(): React.ReactElement {
  const bars = [6, 12, 20, 14, 22, 16, 8, 4];
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        height: 48,
      }}
    >
      {bars.map((h, idx) => (
        <View
          key={idx}
          style={{
            width: 4,
            height: h * 2,
            borderRadius: 2,
            backgroundColor: '#3B82F6',
          }}
        />
      ))}
    </View>
  );
}
