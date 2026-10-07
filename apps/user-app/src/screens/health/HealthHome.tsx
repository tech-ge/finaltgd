import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { StepRing } from '../../components/health/StepRing';
import { VitalChart } from '../../components/health/VitalChart';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function HealthHome(): React.ReactElement {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.lg, gap: spacing.lg }}>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.semibold,
          }}
        >
          Health
        </Text>
        <StepRing steps={4200} target={8000} />
        <VitalChart samples={[62, 64, 68, 66, 70, 72]} />
      </View>
    </SafeAreaView>
  );
}
