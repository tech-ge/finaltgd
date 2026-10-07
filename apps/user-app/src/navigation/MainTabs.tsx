import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { AssistantHome } from '../screens/assistant/AssistantHome';
import { HealthHome } from '../screens/health/HealthHome';
import { MapHome } from '../screens/map/MapHome';
import { WalletHome } from '../screens/wallet/WalletHome';

export type MainTabParamList = {
  Wallet: undefined;
  Map: undefined;
  Health: undefined;
  Assistant: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs(): React.ReactElement {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Wallet" component={WalletHome} />
      <Tab.Screen name="Map" component={MapHome} />
      <Tab.Screen name="Health" component={HealthHome} />
      <Tab.Screen name="Assistant" component={AssistantHome} />
    </Tab.Navigator>
  );
}
