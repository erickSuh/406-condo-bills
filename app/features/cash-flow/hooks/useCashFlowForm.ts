import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useAlert } from '@/shared/context/AlertContext';
import { CashFlowRepository } from '../api';
import { useDatabase } from '@/shared/context/DatabaseContext';

export interface CashFlowFormData {
  parentAccountId: string | number;
  code: string;
  title: string;
  type: string | number;
  acceptsEntries: string | number;
}

export const useCashFlowForm = () => {
  const { showAlert } = useAlert();
  const { db } = useDatabase();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CashFlowFormData>({
    defaultValues: {
      parentAccountId: '1',
      code: '',
      title: '',
      type: '0',
      acceptsEntries: '1',
    },
  });

  const onSubmit = useCallback(
    async (data: CashFlowFormData) => {
      if (!db) return false;

      setIsLoading(true);
      try {
        const repository = new CashFlowRepository(db);

        // TODO: Implement actual insert logic
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

        showAlert({
          title: 'Success',
          message: 'Account created successfully',
          type: 'success',
        });

        reset();
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to create account';
        showAlert({
          title: 'Error',
          message,
          type: 'error',
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [db, showAlert, reset],
  );

  return {
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    reset,
    isLoading,
  };
};
