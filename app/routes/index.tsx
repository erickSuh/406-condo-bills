import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const WelcomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Welcome</Text>
  </View>
);

const UserIdentificationScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>User Identification</Text>
  </View>
);

const ListSelectScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Select List</Text>
  </View>
);

const ListItemsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>List Items</Text>
  </View>
);

const RootNavigator = () => {
  return (
    <Stack.Navigator
      id="RootStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="UserIdentification"
        component={UserIdentificationScreen}
      />
      <Stack.Screen name="ListSelect" component={ListSelectScreen} />
      <Stack.Screen name="ListItems" component={ListItemsScreen} />
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
