import React from 'react';
import { View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

export interface CardProps {
  children: React.ReactNode;
}

export function Card({ children }: CardProps): React.ReactElement {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.lg,
        padding: spacing.lg,
      }}
    >
      {children}
    </View>
  );
}
