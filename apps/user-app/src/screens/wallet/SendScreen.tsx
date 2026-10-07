import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { isPositiveAmount } from '../../utils/currency';

export function SendScreen(): React.ReactElement {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const canSend = recipient.trim().length > 0 && isPositiveAmount(amount);

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
          Send TGD
        </Text>

        <TextInput
          value={recipient}
          onChangeText={setRecipient}
          placeholder="Recipient account"
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

        <TouchableOpacity
          disabled={!canSend}
          style={{
            backgroundColor: canSend ? colors.primary : colors.surfaceElevated,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: canSend ? colors.textPrimary : colors.textMuted,
              fontWeight: typography.weights.semibold,
            }}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
