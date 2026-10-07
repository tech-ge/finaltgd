import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';

export function EmergencyCenter(): React.ReactElement {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F1A' }}>
      <View style={{ flex: 1, padding: 24, gap: 16 }}>
        <Text style={{ color: '#F5F7FB', fontSize: 22, fontWeight: '600' }}>
          Emergency center
        </Text>
        <Text style={{ color: '#A7B1C4', fontSize: 14 }}>
          The assistant places emergency calls on accident or health crisis
          detection. Emergency dialing bypasses AI restrictions.
        </Text>
      </View>
    </SafeAreaView>
  );
}
