import React from 'react';

import { colors } from '../theme/colors.js';
import { radius, spacing } from '../theme/spacing.js';
import { typography } from '../theme/typography.js';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

function backgroundColor(variant: ButtonVariant, disabled: boolean): string {
  if (disabled) {
    return colors.surfaceElevated;
  }
  switch (variant) {
    case 'primary':
      return colors.primary;
    case 'secondary':
      return colors.surfaceElevated;
    case 'danger':
      return colors.danger;
    case 'ghost':
      return colors.transparent;
  }
}

function textColor(variant: ButtonVariant, disabled: boolean): string {
  if (disabled) {
    return colors.textMuted;
  }
  if (variant === 'ghost') {
    return colors.primary;
  }
  return colors.textPrimary;
}

function paddingY(size: ButtonSize): number {
  switch (size) {
    case 'sm':
      return spacing.xs;
    case 'md':
      return spacing.sm;
    case 'lg':
      return spacing.md;
  }
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps): React.ReactElement {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      style={{
        backgroundColor: backgroundColor(variant, isDisabled),
        color: textColor(variant, isDisabled),
        paddingTop: paddingY(size),
        paddingBottom: paddingY(size),
        paddingLeft: spacing.lg,
        paddingRight: spacing.lg,
        borderRadius: radius.md,
        border: variant === 'secondary' ? `1px solid ${colors.border}` : 'none',
        fontFamily: typography.fontFamily,
        fontWeight: typography.weights.semibold,
        fontSize: typography.sizes.md,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? 'Working' : label}
    </button>
  );
}
