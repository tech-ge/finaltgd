import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

import { CallCard } from '../components/CallCard';

export function CallInbox(): React.ReactElement {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F1A' }}>
      <View style={{ flex: 1, padding: 24, gap: 16 }}>
        <Text style={{ color: '#F5F7FB', fontSize: 22, fontWeight: '600' }}>
          Call inbox
        </Text>
        <CallCard caller="Unknown" at="just now" handled={false} />
      </View>
    </SafeAreaView>
  );
}
