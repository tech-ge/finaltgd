import React from 'react';
import { Modal as RNModal, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export interface ModalProps {
  visible: boolean;
  title: string;
  children: React.ReactNode;
}

export function Modal({ visible, title, children }: ModalProps): React.ReactElement {
  return (
    <RNModal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.xl,
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            padding: spacing.xl,
            width: '100%',
          }}
        >
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: typography.sizes.lg,
              fontWeight: typography.weights.semibold,
              marginBottom: spacing.md,
            }}
          >
            {title}
          </Text>
          {children}
        </View>
      </View>
    </RNModal>
  );
}
