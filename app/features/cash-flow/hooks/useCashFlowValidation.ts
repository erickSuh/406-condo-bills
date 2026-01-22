import { useCallback } from 'react';
import { CashFlowRepository } from '../api';
import { useDatabase } from '@/shared/context/DatabaseContext';
import { CashFlowItem } from '../types';
import {
  CODE_PATTERN_MAX_DEPTH_6,
  CASH_FLOW_FORM_NAMESPACE,
} from '../constants';
import { useTranslation } from 'react-i18next';

export const useCashFlowValidation = () => {
  const { db } = useDatabase();
  const { t } = useTranslation([CASH_FLOW_FORM_NAMESPACE, 'common']);

  const validateCode = useCallback(
    async (
      code: string,
      parentAccountId: string,
      parentItems: CashFlowItem[],
      suggestedCode?: string,
    ): Promise<string | true> => {
      // Check if code is empty
      if (!code.trim()) {
        return t('errorCodeBeEmpty', {
          ns: CASH_FLOW_FORM_NAMESPACE,
          defaultValue: 'Código não pode estar vazio',
        });
      }

      if (!CODE_PATTERN_MAX_DEPTH_6.test(code)) {
        return t('errorCodeFormat', {
          ns: CASH_FLOW_FORM_NAMESPACE,
          defaultValue:
            'O código deve estar no formato válido (ex: 1, 123, 1.2, 1.23.456)',
        });
      }

      const segments = code.split('.');
      for (const segment of segments) {
        if (parseInt(segment, 10) > 999) {
          return t('errorSegmentsLimit', {
            ns: CASH_FLOW_FORM_NAMESPACE,
            defaultValue: 'Cada segmento do código não pode ser maior que 999',
          });
        }
      }

      if (segments.length === 1) {
        return true;
      }

      // Validate depth based on suggested code (not parent)
      if (suggestedCode) {
        const suggestedSegments = suggestedCode.split('.');
        const maxAllowedDepth = suggestedSegments.length + 1;
        const actualDepth = segments.length;

        if (actualDepth > maxAllowedDepth) {
          return t('errorCodeDepthExceeded', {
            ns: CASH_FLOW_FORM_NAMESPACE,
            expectedDepth: maxAllowedDepth,
            defaultValue: `O código deve ter no máximo ${maxAllowedDepth} segmentos`,
          });
        }
      }

      if (!db) {
        return t('errorDatabaseNotAvailable', {
          ns: CASH_FLOW_FORM_NAMESPACE,
          defaultValue: 'Banco de dados não disponível',
        });
      }

      try {
        const repository = new CashFlowRepository(db);
        const existingItem = await repository.getCashFlowByCode(code);

        if (existingItem) {
          return t('errorExistingCode', {
            ns: CASH_FLOW_FORM_NAMESPACE,
            defaultValue: 'Este código já existe',
          });
        }
      } catch (error) {
        console.error('Failed to validate code:', error);
        return t('errorValidationFailed', {
          ns: CASH_FLOW_FORM_NAMESPACE,
          defaultValue: 'Falha ao validar código',
        });
      }

      return true;
    },
    [db, t],
  );

  return { validateCode };
};
