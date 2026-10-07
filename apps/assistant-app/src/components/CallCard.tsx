import React from 'react';
import { Text, View } from 'react-native';

export interface CallCardProps {
  caller: string;
  at: string;
  handled: boolean;
}

export function CallCard({ caller, at, handled }: CallCardProps): React.ReactElement {
  return (
    <View
      style={{
        backgroundColor: '#1A2234',
        padding: 14,
        borderRadius: 10,
        gap: 4,
      }}
    >
      <Text style={{ color: '#F5F7FB', fontSize: 15 }}>{caller}</Text>
      <Text style={{ color: '#A7B1C4', fontSize: 12 }}>{at}</Text>
      <Text style={{ color: handled ? '#10B981' : '#F59E0B', fontSize: 12 }}>
        {handled ? 'Handled by assistant' : 'Forwarded to user'}
      </Text>
    </View>
  );
}
