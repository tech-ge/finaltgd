import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { TxRow } from '../../components/wallet/TxRow';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function TransactionHistory(): React.ReactElement {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.xl, gap: spacing.md }}>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.semibold,
          }}
        >
          History
        </Text>
        <TxRow label="No history" amount="" at="" />
      </View>
    </SafeAreaView>
  );
}
