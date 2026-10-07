import React from 'react';

import { colors } from '../theme/colors.js';
import { radius, spacing } from '../theme/spacing.js';
import { typography } from '../theme/typography.js';

export interface InputProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  error?: string;
  label?: string;
}

export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  label,
}: InputProps): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
      {label ? (
        <span
          style={{
            color: colors.textSecondary,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.medium,
          }}
        >
          {label}
        </span>
      ) : null}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          backgroundColor: colors.surfaceElevated,
          color: colors.textPrimary,
          border: `1px solid ${error ? colors.danger : colors.border}`,
          borderRadius: radius.md,
          paddingTop: spacing.sm,
          paddingBottom: spacing.sm,
          paddingLeft: spacing.md,
          paddingRight: spacing.md,
          fontFamily: typography.fontFamily,
          fontSize: typography.sizes.md,
          outline: 'none',
        }}
      />
      {error ? (
        <span style={{ color: colors.danger, fontSize: typography.sizes.xs }}>{error}</span>
      ) : null}
    </div>
  );
}
