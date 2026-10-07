import React from 'react';
import { View } from 'react-native';

import { colors } from '../../theme/colors';

export interface VoiceOrbProps {
  active: boolean;
}

export function VoiceOrb({ active }: VoiceOrbProps): React.ReactElement {
  return (
    <View
      style={{
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: active ? colors.primary : colors.surfaceElevated,
        alignSelf: 'center',
      }}
    />
  );
}
