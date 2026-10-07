import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { MainTabs } from './MainTabs';
import { WalletHome } from '../screens/wallet/WalletHome';

export type RootStackParamList = {
  Main: undefined;
  Wallet: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Wallet" component={WalletHome} />
    </Stack.Navigator>
  );
}
