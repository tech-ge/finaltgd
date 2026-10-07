import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { isPositiveAmount } from '../../utils/currency';

export function DepositScreen(): React.ReactElement {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('KES');

  const canSubmit = isPositiveAmount(amount);

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
          Deposit
        </Text>

        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="Amount"
          placeholderTextColor={colors.textMuted}
          style={{
            backgroundColor: colors.surface,
            color: colors.textPrimary,
            padding: spacing.md,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />

        <TextInput
          value={currency}
          onChangeText={setCurrency}
          autoCapitalize="characters"
          maxLength={3}
          style={{
            backgroundColor: colors.surface,
            color: colors.textPrimary,
            padding: spacing.md,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        />

        <TouchableOpacity
          disabled={!canSubmit}
          style={{
            backgroundColor: canSubmit ? colors.primary : colors.surfaceElevated,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: canSubmit ? colors.textPrimary : colors.textMuted,
              fontWeight: typography.weights.semibold,
            }}
          >
            Confirm deposit
          </Text>
        </TouchableOpacity>

        <Text style={{ color: colors.textMuted, fontSize: typography.sizes.xs }}>
          Value enters the ledger. Withdrawal is not available.
        </Text>
      </View>
    </SafeAreaView>
  );
}
