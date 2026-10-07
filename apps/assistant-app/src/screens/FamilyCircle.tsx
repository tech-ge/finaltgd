import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export function FamilyCircle(): React.ReactElement {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F1A' }}>
      <View style={{ flex: 1, padding: 24, gap: 16 }}>
        <Text style={{ color: '#F5F7FB', fontSize: 22, fontWeight: '600' }}>
          Family circle
        </Text>
        <Text style={{ color: '#A7B1C4', fontSize: 14 }}>
          Broadcast announcements and start group calls within your circle.
        </Text>
      </View>
    </SafeAreaView>
  );
}
