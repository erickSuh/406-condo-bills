import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CashFlowItem } from '@/features/cash-flow/types';

export type RootStackParamList = {
  CashFlowListScreen: undefined;
  CashFlowFormScreen: { item?: CashFlowItem; isReadOnly?: boolean };
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
