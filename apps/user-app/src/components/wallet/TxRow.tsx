import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface TxRowProps {
  label: string;
  amount: string;
  at: string;
}

export function TxRow({ label, amount, at }: TxRowProps): React.ReactElement {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ color: colors.textPrimary, fontSize: typography.sizes.sm }}>{label}</Text>
      <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm }}>
        {amount} {at}
      </Text>
    </View>
  );
}
