import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import type { AuthStackParamList } from '../../navigation/AuthStack';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'NationalId'>;

export function NationalIdScreen({ navigation }: Props): React.ReactElement {
  const [nationalId, setNationalId] = useState('');
  const [fullName, setFullName] = useState('');

  const canContinue = nationalId.trim().length >= 6 && fullName.trim().length >= 3;

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
          Verify identity
        </Text>

        <View style={{ gap: spacing.sm }}>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm }}>
            National ID
          </Text>
          <TextInput
            value={nationalId}
            onChangeText={setNationalId}
            keyboardType="number-pad"
            placeholder="Enter your national ID"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              padding: spacing.md,
              borderRadius: radius.md,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm }}>
            Full name
          </Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="As printed on your ID"
            placeholderTextColor={colors.textMuted}
            style={{
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              padding: spacing.md,
              borderRadius: radius.md,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          />
        </View>

        <TouchableOpacity
          disabled={!canContinue}
          onPress={() => navigation.navigate('DeviceBind')}
          style={{
            backgroundColor: canContinue ? colors.primary : colors.surfaceElevated,
            paddingVertical: spacing.md,
            borderRadius: radius.md,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: canContinue ? colors.textPrimary : colors.textMuted,
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
