import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { MapView } from '../../components/map/MapView';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function MapHome(): React.ReactElement {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.lg, gap: spacing.md }}>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.semibold,
          }}
        >
          Map
        </Text>
        <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
          <MapView
            origin={{ lat: -1.2921, lon: 36.8219 }}
            destination={{ lat: -1.3000, lon: 36.8300 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
