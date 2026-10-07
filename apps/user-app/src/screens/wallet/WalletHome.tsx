import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { BalanceCard } from '../../components/wallet/BalanceCard';
import { TxRow } from '../../components/wallet/TxRow';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { RootState } from '../../store';

export function WalletHome(): React.ReactElement {
  const wallet = useSelector((state: RootState) => state.wallet);

  const sampleTx = [
    { id: '1', label: 'Deposit from M-Pesa', amount: '+ 1.0000', at: 'Today' },
    { id: '2', label: 'Sent to Kibera Store', amount: '- 0.2500', at: 'Yesterday' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.lg, gap: spacing.lg }}>
        <BalanceCard balance={wallet.balance} currency={wallet.currency} />

        <Text
          style={{
            color: colors.textSecondary,
            fontSize: typography.sizes.sm,
            marginTop: spacing.md,
          }}
        >
          Recent activity
        </Text>

        <View style={{ gap: spacing.sm }}>
          {sampleTx.map((tx) => (
            <TxRow key={tx.id} label={tx.label} amount={tx.amount} at={tx.at} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
