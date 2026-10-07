import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface QrScannerProps {
  onScanned: (value: string) => void;
}

export function QrScanner({ onScanned }: QrScannerProps): React.ReactElement {
  void onScanned;
  return (
    <View
      style={{
        aspectRatio: 1,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
      }}
    >
      <Text style={{ color: colors.textMuted, fontSize: typography.sizes.sm }}>
        Point camera at the QR
      </Text>
    </View>
  );
}
