import React from 'react';

import { colors } from '../theme/colors.js';
import { radius, spacing } from '../theme/spacing.js';

export interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  padding?: number;
}

export function Card({ children, elevated = false, padding = spacing.lg }: CardProps): React.ReactElement {
  return (
    <div
      style={{
        backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radius.lg,
        padding,
      }}
    >
      {children}
    </div>
  );
}
