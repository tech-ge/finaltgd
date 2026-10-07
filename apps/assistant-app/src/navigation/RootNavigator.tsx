import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { AssistantDashboard } from '../screens/AssistantDashboard';
import { CallInbox } from '../screens/CallInbox';
import { EmergencyCenter } from '../screens/EmergencyCenter';
import { FamilyCircle } from '../screens/FamilyCircle';
import { VoiceCloneWizard } from '../screens/VoiceCloneWizard';
import { VoiceOnboarding } from '../screens/VoiceOnboarding';

export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: undefined;
  VoiceClone: undefined;
  CallInbox: undefined;
  Emergency: undefined;
  FamilyCircle: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={VoiceOnboarding} />
      <Stack.Screen name="Dashboard" component={AssistantDashboard} />
      <Stack.Screen name="VoiceClone" component={VoiceCloneWizard} />
      <Stack.Screen name="CallInbox" component={CallInbox} />
      <Stack.Screen name="Emergency" component={EmergencyCenter} />
      <Stack.Screen name="FamilyCircle" component={FamilyCircle} />
    </Stack.Navigator>
  );
}
