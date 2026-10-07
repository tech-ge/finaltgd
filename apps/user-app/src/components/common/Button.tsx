import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({ label, onPress, disabled = false }: ButtonProps): React.ReactElement {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? colors.surfaceElevated : colors.primary,
        paddingVertical: spacing.md,
        borderRadius: radius.md,
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: disabled ? colors.textMuted : colors.textPrimary,
          fontWeight: typography.weights.semibold,
          fontSize: typography.sizes.md,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
