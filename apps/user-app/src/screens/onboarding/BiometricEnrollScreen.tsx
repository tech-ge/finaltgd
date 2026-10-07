import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { useBiometrics } from '../../hooks/useBiometrics';
import type { AuthStackParamList } from '../../navigation/AuthStack';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'BiometricEnroll'>;

export function BiometricEnrollScreen({ navigation }: Props): React.ReactElement {
  const biometrics = useBiometrics();

  const handleEnroll = async (): Promise<void> => {
    const ok = await biometrics.authenticate();
    if (ok) {
      navigation.popToTop();
    }
  };

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
          Enable biometrics
        </Text>

        <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.md }}>
          Payments require a biometric handshake on this device. The
          laptop mirror cannot transact.
        </Text>

        <TouchableOpacity
          onPress={() => void handleEnroll()}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontWeight: typography.weights.semibold,
            }}
          >
            Enroll now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
