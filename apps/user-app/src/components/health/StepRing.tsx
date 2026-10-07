import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export interface StepRingProps {
  steps: number;
  target: number;
}

export function StepRing({ steps, target }: StepRingProps): React.ReactElement {
  const progress = Math.min(1, target > 0 ? steps / target : 0);
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        borderWidth: 4,
        borderRadius: 9999,
        borderColor: colors.primary,
      }}
    >
      <Text style={{ color: colors.textPrimary, fontSize: typography.sizes.xl }}>
        {steps}
      </Text>
      <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
        {Math.round(progress * 100)}% of {target}
      </Text>
    </View>
  );
}
