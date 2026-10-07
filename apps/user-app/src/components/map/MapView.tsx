import React from 'react';
import { View } from 'react-native';

import { colors } from '../../theme/colors';
import { RouteLine } from './RouteLine';

export interface MapViewProps {
  origin: { lat: number; lon: number };
  destination: { lat: number; lon: number };
}

export function MapView({ origin, destination }: MapViewProps): React.ReactElement {
  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceElevated }}>
      <RouteLine origin={origin} destination={destination} />
    </View>
  );
}
