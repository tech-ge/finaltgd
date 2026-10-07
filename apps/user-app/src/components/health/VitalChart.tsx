import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export interface VitalChartProps {
  samples: number[];
}

export function VitalChart({ samples }: VitalChartProps): React.ReactElement {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        padding: 12,
        borderRadius: 10,
        minHeight: 80,
        justifyContent: 'center',
      }}
    >
      {samples.length === 0 ? (
        <Text style={{ color: colors.textMuted, fontSize: typography.sizes.sm }}>
          No samples yet
        </Text>
      ) : (
        <Text style={{ color: colors.textPrimary, fontSize: typography.sizes.sm }}>
          {samples.join(' · ')}
        </Text>
      )}
    </View>
  );
}
