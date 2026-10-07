import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import type { AuthStackParamList } from '../../navigation/AuthStack';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'DeviceBind'>;

export function DeviceBindScreen({ navigation }: Props): React.ReactElement {
  const [bound, setBound] = useState(false);

  useEffect(() => {
    setBound(true);
  }, []);

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
          Bind this phone
        </Text>

        <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.md }}>
          This device will be locked to your account. A second device will
          require a formal dispute and a new identity verification.
        </Text>

        <View
          style={{
            backgroundColor: colors.surface,
            padding: spacing.lg,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm }}>
            Status
          </Text>
          <Text
            style={{
              color: bound ? colors.success : colors.warning,
              fontSize: typography.sizes.md,
              fontWeight: typography.weights.semibold,
              marginTop: spacing.xs,
            }}
          >
            {bound ? 'Device fingerprint captured' : 'Waiting for capture'}
          </Text>
        </View>

        <TouchableOpacity
          disabled={!bound}
          onPress={() => navigation.navigate('BiometricEnroll')}
          style={{
            backgroundColor: bound ? colors.primary : colors.surfaceElevated,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: bound ? colors.textPrimary : colors.textMuted,
              fontWeight: typography.weights.semibold,
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
