import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatTgd } from '../../utils/format';

export interface BalanceCardProps {
  balance: string;
  currency: string;
}

export function BalanceCard({ balance, currency }: BalanceCardProps): React.ReactElement {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        padding: spacing.xl,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm }}>
        Balance
      </Text>
      <Text
        style={{
          color: colors.textPrimary,
          fontSize: typography.sizes.display,
          fontWeight: typography.weights.bold,
          marginTop: spacing.xs,
        }}
      >
        {formatTgd(balance)} {currency}
      </Text>
    </View>
  );
}
