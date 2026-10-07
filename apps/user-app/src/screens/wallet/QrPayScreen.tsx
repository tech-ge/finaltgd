import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { QrScanner } from '../../components/wallet/QrScanner';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function QrPayScreen(): React.ReactElement {
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
          Pay by QR
        </Text>
        <QrScanner onScanned={() => undefined} />
      </View>
    </SafeAreaView>
  );
}
