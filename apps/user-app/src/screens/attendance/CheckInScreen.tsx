import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { useGps } from '../../hooks/useGps';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function CheckInScreen(): React.ReactElement {
  const gps = useGps();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.xl, gap: spacing.lg }}>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.semibold,
          }}
        >
          Check in
        </Text>
        <Text style={{ color: colors.textSecondary }}>
          Dual layer verification. IP must match the corporate gateway and
          GPS must be within 50 meters.
        </Text>

        <TouchableOpacity
          onPress={() => void gps.request()}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.textPrimary, fontWeight: typography.weights.semibold }}>
            Capture location
          </Text>
        </TouchableOpacity>

        {gps.position ? (
          <Text style={{ color: colors.success, fontSize: typography.sizes.sm }}>
            Captured: {gps.position.lat.toFixed(4)}, {gps.position.lon.toFixed(4)}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
