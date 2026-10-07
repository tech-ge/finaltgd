import React from 'react';

import { colors } from '../theme/colors.js';
import { radius, spacing } from '../theme/spacing.js';

export interface QrCodeProps {
  value: string;
  size?: number;
}

export function QrCode({ value, size = 240 }: QrCodeProps): React.ReactElement {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: colors.surfaceElevated,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.md,
        padding: spacing.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.textMuted,
        wordBreak: 'break-all',
        fontSize: 12,
      }}
      aria-label="QR placeholder"
    >
      {value.slice(0, 64)}
    </div>
  );
}
