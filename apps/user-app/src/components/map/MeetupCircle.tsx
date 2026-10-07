import React from 'react';
import { Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export interface MeetupCircleProps {
  radiusMeters: number;
}

export function MeetupCircle({ radiusMeters }: MeetupCircleProps): React.ReactElement {
  return (
    <View
      style={{
        width: radiusMeters,
        height: radiusMeters,
        borderRadius: radiusMeters / 2,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.xs }}>
        {radiusMeters} m
      </Text>
    </View>
  );
}
