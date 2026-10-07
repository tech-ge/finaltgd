import { Audio } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface EnrollmentRecorderProps {
  onComplete: () => void;
}

export function EnrollmentRecorder({ onComplete }: EnrollmentRecorderProps): React.ReactElement {
  const recording = useRef<Audio.Recording | null>(null);
  const [status, setStatus] = useState<'idle' | 'recording' | 'stopped'>('idle');

  useEffect(() => {
    return () => {
      void recording.current?.stopAndUnloadAsync();
    };
  }, []);

  const start = async (): Promise<void> => {
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) {
      return;
    }
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    recording.current = rec;
    setStatus('recording');
  };

  const stop = async (): Promise<void> => {
    if (!recording.current) {
      return;
    }
    await recording.current.stopAndUnloadAsync();
    recording.current = null;
    setStatus('stopped');
    onComplete();
  };

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: '#A7B1C4', fontSize: 14 }}>Status: {status}</Text>

      {status === 'idle' ? (
        <TouchableOpacity
          onPress={() => void start()}
          style={{
            backgroundColor: '#3B82F6',
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#F5F7FB', fontWeight: '600' }}>Begin</Text>
        </TouchableOpacity>
      ) : null}

      {status === 'recording' ? (
        <TouchableOpacity
          onPress={() => void stop()}
          style={{
            backgroundColor: '#EF4444',
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#F5F7FB', fontWeight: '600' }}>Stop and enroll</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
