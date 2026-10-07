import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { VoiceOrb } from '../../components/assistant/VoiceOrb';
import { Waveform } from '../../components/assistant/Waveform';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function AssistantHome(): React.ReactElement {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.lg, gap: spacing.lg }}>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: typography.sizes.xl,
            fontWeight: typography.weights.semibold,
          }}
        >
          Assistant
        </Text>
        <VoiceOrb active={false} />
        <Waveform />
      </View>
    </SafeAreaView>
  );
}
