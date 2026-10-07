import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { BiometricEnrollScreen } from '../screens/onboarding/BiometricEnrollScreen';
import { DeviceBindScreen } from '../screens/onboarding/DeviceBindScreen';
import { NationalIdScreen } from '../screens/onboarding/NationalIdScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  NationalId: undefined;
  DeviceBind: undefined;
  BiometricEnroll: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack(): React.ReactElement {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="NationalId" component={NationalIdScreen} />
      <Stack.Screen name="DeviceBind" component={DeviceBindScreen} />
      <Stack.Screen name="BiometricEnroll" component={BiometricEnrollScreen} />
    </Stack.Navigator>
  );
}
