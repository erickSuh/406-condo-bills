import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Welcome: undefined;
  UserIdentification: undefined;
  ListSelect: undefined;
  ListItems: {
    listId: number;
  };
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export type WelcomeScreenRouteProp = RouteProp<RootStackParamList, 'Welcome'>;
export type UserIdentificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'UserIdentification'
>;
export type ListSelectScreenRouteProp = RouteProp<
  RootStackParamList,
  'ListSelect'
>;
export type ListItemsScreenRouteProp = RouteProp<
  RootStackParamList,
  'ListItems'
>;
