import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function MoveToEarnScreen(): React.ReactElement {
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
          Move to Earn
        </Text>
        <Text style={{ color: colors.textSecondary }}>
          Reach your daily step and active minute targets to receive a
          fractional TGD reward.
        </Text>
      </View>
    </SafeAreaView>
  );
}
