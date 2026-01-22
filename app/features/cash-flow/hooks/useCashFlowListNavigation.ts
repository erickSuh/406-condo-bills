import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/routes/types';
import { CashFlowItem } from '../types';

export const useCashFlowListNavigation = () => {
  const { navigate } = useNavigation<RootStackNavigationProp>();

  const handleNavigateToForm = useCallback(() => {
    navigate('CashFlowFormScreen');
  }, [navigate]);

  const handleCardPress = useCallback(
    (item: CashFlowItem) => {
      navigate('CashFlowFormScreen', { item, isReadOnly: true });
    },
    [navigate],
  );

  return {
    handleNavigateToForm,
    handleCardPress,
  };
};
