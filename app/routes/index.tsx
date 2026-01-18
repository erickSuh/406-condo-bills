import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { CashFlowListScreen } from '@/features/cash-flow/screens/CashFlowListScreen';
import { CashFlowFormScreen } from '@/features/cash-flow/screens/CashFlowFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      id="RootStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CashFlowListScreen" component={CashFlowListScreen} />
      <Stack.Screen name="CashFlowFormScreen" component={CashFlowFormScreen} />
    </Stack.Navigator>
  );
};

const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Routes;
