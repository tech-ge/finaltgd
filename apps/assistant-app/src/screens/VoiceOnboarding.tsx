import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function VoiceOnboarding({ navigation }: Props): React.ReactElement {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F1A' }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
        <View>
          <Text style={{ color: '#F5F7FB', fontSize: 28, fontWeight: '700' }}>
            Voice Assistant
          </Text>
          <Text style={{ color: '#A7B1C4', fontSize: 16, marginTop: 12 }}>
            The assistant speaks in your voice and acts on your behalf within
            the rules you set.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('VoiceClone')}
          style={{
            backgroundColor: '#3B82F6',
            paddingVertical: 14,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#F5F7FB', fontWeight: '600', fontSize: 16 }}>
            Enroll my voice
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
