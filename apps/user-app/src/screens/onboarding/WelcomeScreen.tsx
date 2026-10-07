import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import type { AuthStackParamList } from '../../navigation/AuthStack';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen(): React.ReactElement {
  const navigation = useNavigation<Navigation>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.xl, justifyContent: 'space-between' }}>
        <View style={{ marginTop: spacing.xxl }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typography.sizes.display,
              fontWeight: typography.weights.bold,
            }}
          >
            TechGeo
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.sizes.md,
              marginTop: spacing.md,
            }}
          >
            Verified identity. Internal ledger. Real-world routing.
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('NationalId')}
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
                fontSize: typography.sizes.md,
              }}
            >
              Begin verification
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              color: colors.textMuted,
              fontSize: typography.sizes.xs,
              textAlign: 'center',
            }}
          >
            One phone binds to one account. This cannot be changed without
            a formal dispute.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
