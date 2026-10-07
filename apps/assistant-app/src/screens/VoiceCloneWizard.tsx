import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { EnrollmentRecorder } from '../voice-clone/EnrollmentRecorder';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceClone'>;

export function VoiceCloneWizard({ navigation }: Props): React.ReactElement {
  const [stage, setStage] = useState<'idle' | 'recording' | 'done'>('idle');

  const handleComplete = (): void => {
    setStage('done');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0F1A' }}>
      <View style={{ flex: 1, padding: 24, gap: 16 }}>
        <Text style={{ color: '#F5F7FB', fontSize: 22, fontWeight: '600' }}>
          Voice enrollment
        </Text>
        <Text style={{ color: '#A7B1C4', fontSize: 14 }}>
          Record a short sample. The fingerprint stays scoped to your account.
        </Text>

        {stage === 'idle' ? (
          <TouchableOpacity
            onPress={() => setStage('recording')}
            style={{
              backgroundColor: '#3B82F6',
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#F5F7FB', fontWeight: '600' }}>Start recording</Text>
          </TouchableOpacity>
        ) : null}

        {stage === 'recording' ? <EnrollmentRecorder onComplete={handleComplete} /> : null}

        {stage === 'done' ? (
          <View style={{ gap: 12 }}>
            <Text style={{ color: '#10B981', fontSize: 14 }}>Enrollment complete</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard')}
              style={{
                backgroundColor: '#10B981',
                paddingVertical: 12,
                borderRadius: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#F5F7FB', fontWeight: '600' }}>Continue</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
