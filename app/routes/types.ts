import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  CashFlowListScreen: undefined;
  CashFlowFormScreen: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
