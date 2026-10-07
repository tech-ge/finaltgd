import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '../../theme/colors';

export function Loader(): React.ReactElement {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}
