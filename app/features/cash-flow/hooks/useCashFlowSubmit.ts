import { useCallback } from 'react';
import type { NavigationProp } from '@react-navigation/native';
import { CashFlowRepository } from '../api';
import { useDatabase } from '@/shared/context/DatabaseContext';
import { useAlert } from '@/shared/context/AlertContext';
import { CreateCashFlowInput } from '../types';
import { useTranslation } from 'react-i18next';

type CashFlowNavigation = NavigationProp<any>;

export const useCashFlowSubmit = (navigation: CashFlowNavigation) => {
  const { db } = useDatabase();
  const { showAlert } = useAlert();
  const { t } = useTranslation('messages');

  const submitCashFlow = useCallback(
    async (data: CreateCashFlowInput, refetchItems: () => Promise<void>) => {
      if (!db) {
        showAlert({
          title: 'Error',
          message: 'Database not available',
          type: 'error',
        });
        return;
      }

      try {
        const repository = new CashFlowRepository(db);
        await repository.insertCashFlow(data);

        showAlert({
          title: t('success', { ns: 'messages', defaultValue: 'Sucesso' }),
          message: t('itemCreated', {
            ns: 'messages',
            defaultValue: 'Item criado com sucesso',
          }),
          type: 'success',
        });
        await refetchItems();
        navigation.goBack();
      } catch (error) {
        console.error('Failed to create cash flow:', error);
        const message =
          error instanceof Error ? error.message : 'Failed to create account';
        showAlert({
          title: 'Error',
          message,
          type: 'error',
        });
      }
    },
    [db, showAlert, navigation, t],
  );

  return { submitCashFlow };
};
