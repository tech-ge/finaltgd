import React from 'react';
import { View } from 'react-native';

export interface WeatherOverlayProps {
  precipitationMm: number;
}

export function WeatherOverlay({ precipitationMm }: WeatherOverlayProps): React.ReactElement {
  const opacity = Math.min(0.4, precipitationMm / 20);
  return <View style={{ flex: 1, backgroundColor: `rgba(14,165,233,${opacity})` }} />;
}
