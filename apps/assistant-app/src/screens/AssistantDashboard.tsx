import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { VoiceOrb } from '../components/VoiceOrb';
import { Waveform } from '../components/Waveform';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export function AssistantDashboard({ navigation }: Props): React.ReactElement {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F1A' }}>
      <View style={{ flex: 1, padding: 24, gap: 24 }}>
        <Text style={{ color: '#F5F7FB', fontSize: 22, fontWeight: '600' }}>
          Assistant
        </Text>
        <VoiceOrb active />
        <Waveform />

        <View style={{ gap: 12, marginTop: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CallInbox')}
            style={{
              backgroundColor: '#1A2234',
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#F5F7FB' }}>Call inbox</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Emergency')}
            style={{
              backgroundColor: '#EF4444',
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#F5F7FB', fontWeight: '600' }}>Emergency center</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('FamilyCircle')}
            style={{
              backgroundColor: '#1A2234',
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#F5F7FB' }}>Family circle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
