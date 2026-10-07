import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function ShortcutLogger(): React.ReactElement {
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
          Shortcut log
        </Text>
        <Text style={{ color: colors.textSecondary }}>
          Recorded shortcuts contribute to custom road candidates.
        </Text>
      </View>
    </SafeAreaView>
  );
}
