import React from 'react';
import { View } from 'react-native';

export interface VoiceOrbProps {
  active: boolean;
}

export function VoiceOrb({ active }: VoiceOrbProps): React.ReactElement {
  return (
    <View
      style={{
        width: 140,
        height: 140,
        borderRadius: 70,
        alignSelf: 'center',
        backgroundColor: active ? '#3B82F6' : '#1A2234',
      }}
    />
  );
}
