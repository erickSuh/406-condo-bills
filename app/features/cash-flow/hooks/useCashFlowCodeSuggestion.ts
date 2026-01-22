import { useCallback } from 'react';
import { CashFlowRepository } from '../api';
import { useDatabase } from '@/shared/context/DatabaseContext';
import { CashFlowItem } from '../types';
import { suggestNextCode } from '../utils/suggestNextCode';

export const useCashFlowCodeSuggestion = () => {
  const { db } = useDatabase();

  const suggestCode = useCallback(
    async (
      parentItem?: CashFlowItem,
    ): Promise<{ code: string; prefix: string }> => {
      if (!db) {
        return { code: '', prefix: '' };
      }

      try {
        const repository = new CashFlowRepository(db);
        const allCashFlows = await repository.getCashFlowChildren();

        if (!parentItem) {
          const firstLevelCodes = allCashFlows
            .filter(item => !item.code.includes('.'))
            .map(item => item.code);

          return {
            code: String(
              Math.max(...firstLevelCodes.map(code => Number(code))) + 1,
            ),
            prefix: '',
          };
        }

        const childrenCodes = allCashFlows
          .filter(item => item.code.startsWith(parentItem.code + '.'))
          .map(item => item.code);

        const suggested = suggestNextCode(
          parentItem.code,
          childrenCodes,
          allCashFlows,
        );

        const segments = suggested.split('.');
        const prefix =
          segments.length > 1 ? segments.slice(0, -1).join('.') + '.' : '';

        return { code: suggested, prefix };
      } catch (error) {
        console.error('Failed to suggest code:', error);
        return { code: '', prefix: '' };
      }
    },
    [db],
  );

  return { suggestCode };
};
