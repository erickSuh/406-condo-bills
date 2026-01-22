import { useCallback } from 'react';
import { CashFlowRepository } from '../api';
import { useDatabase } from '@/shared/context/DatabaseContext';
import { CashFlowItem } from '../types';
import { CODE_PATTERN } from '../constants';

export const useCashFlowValidation = () => {
  const { db } = useDatabase();

  const validateCode = useCallback(
    async (
      code: string,
      parentAccountId: string,
      parentItems: CashFlowItem[],
    ): Promise<string | undefined> => {
      if (!code) {
        return undefined;
      }

      if (!CODE_PATTERN.test(code)) {
        return 'Invalid code format';
      }

      const segments = code.split('.');
      for (const segment of segments) {
        if (parseInt(segment, 10) > 999) {
          return 'Each segment must be less than 1000';
        }
      }

      if (segments.length === 1) {
        return undefined;
      }

      const parentCode = segments.slice(0, -1).join('.');
      const parentId = Number(parentAccountId);
      const parentExists = parentItems.some(
        item => item.code === parentCode && item.id === parentId,
      );

      if (!parentExists) {
        return 'Parent code does not exist';
      }

      if (!db) {
        return 'Database not available';
      }

      try {
        const repository = new CashFlowRepository(db);
        const existingItem = await repository.getCashFlowByCode(code);

        if (existingItem) {
          return 'Code already exists';
        }
      } catch (error) {
        console.error('Failed to validate code:', error);
        return 'Failed to validate code';
      }

      return undefined;
    },
    [db],
  );

  return { validateCode };
};
