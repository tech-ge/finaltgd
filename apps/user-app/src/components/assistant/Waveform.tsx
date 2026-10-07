import React from 'react';
import { View } from 'react-native';

import { colors } from '../../theme/colors';

export function Waveform(): React.ReactElement {
  const bars = [4, 8, 12, 8, 16, 10, 6];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 40,
      }}
    >
      {bars.map((h, idx) => (
        <View
          key={idx}
          style={{
            width: 4,
            height: h * 2,
            backgroundColor: colors.primary,
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
}
