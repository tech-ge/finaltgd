import React from 'react';
import { View } from 'react-native';

export interface RouteLineProps {
  origin: { lat: number; lon: number };
  destination: { lat: number; lon: number };
}

export function RouteLine({ origin, destination }: RouteLineProps): React.ReactElement {
  void origin;
  void destination;
  return <View style={{ flex: 1 }} />;
}
