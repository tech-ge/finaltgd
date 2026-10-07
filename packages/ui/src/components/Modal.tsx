import React from 'react';

import { colors } from '../theme/colors.js';
import { radius, spacing } from '../theme/spacing.js';
import { typography } from '../theme/typography.js';

export interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps): React.ReactElement | null {
  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: colors.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.lg,
      }}
    >
      <div
        style={{
          backgroundColor: colors.surface,
          border: `1px solid ${colors.borderStrong}`,
          borderRadius: radius.lg,
          padding: spacing.xl,
          maxWidth: 480,
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.md,
          }}
        >
          <h2
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.lg,
              fontWeight: typography.weights.semibold,
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.textSecondary,
              fontSize: typography.sizes.lg,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
