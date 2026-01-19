import { useForm } from 'react-hook-form';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAlert } from '@/shared/context/AlertContext';
import { CashFlowRepository } from '../api';
import { useDatabase } from '@/shared/context/DatabaseContext';
import { CashFlowItem, FlowType } from '../types';
import { SelectOption } from '@/shared/components';
import { useTranslation } from 'react-i18next';
import { CASH_FLOW_FORM_NAMESPACE } from '../constants';
import { useNavigation } from '@react-navigation/native';

export interface CashFlowFormData {
  parentAccountId: string | number;
  code: string;
  title: string;
  type: string | number;
  acceptsEntries: string | number;
}

const suggestNextCode = (
  parentCode: string,
  childrenCodes: string[],
): string => {
  const parentSegments = parentCode.split('.');
  const requiredDepth = parentSegments.length + 1;

  if (!childrenCodes.length) {
    return `${parentCode}.1`;
  }

  const correctDepthChildren = childrenCodes.filter(code => {
    const segments = code.split('.');
    return segments.length === requiredDepth;
  });

  if (!correctDepthChildren.length) {
    return `${parentCode}.1`;
  }

  const lastSegments = correctDepthChildren.map(code => {
    const parts = code.split('.');
    return parseInt(parts[parts.length - 1], 10);
  });

  const maxSegment = Math.max(...lastSegments);
  const nextSegment = maxSegment + 1;

  if (nextSegment > 999) {
    const segments = parentCode.split('.');
    return segments
      .map((seg, index) => {
        if (index === segments.length - 1) {
          return String(Number(seg) + 1);
        }
        return seg;
      })
      .join('.');
  }

  return `${parentCode}.${nextSegment}`;
};

export const useCashFlowFormScreen = () => {
  const { showAlert } = useAlert();
  const { db, isReady } = useDatabase();
  const [isLoading, setIsLoading] = useState(false);
  const [parentItems, setParentItems] = useState<CashFlowItem[]>([]);
  const [flowTypes, setFlowTypes] = useState<FlowType[]>([]);
  const [suggestedCode, setSuggestedCode] = useState<string>('');
  const { t } = useTranslation([CASH_FLOW_FORM_NAMESPACE, 'common']);
  const { goBack } = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CashFlowFormData>({
    defaultValues: {
      parentAccountId: '1',
      code: '',
      title: '',
      type: '0',
      acceptsEntries: '1',
    },
  });

  const parentAccountIdValue = watch('parentAccountId');
  const typeValue = watch('type');

  const refetchItems = useCallback(async () => {
    if (!db) return;
    try {
      const repository = new CashFlowRepository(db);
      const items = await repository.getCashFlowAbleToBeParent();
      setParentItems(items);
    } catch (error) {
      console.error('Failed to load parent items:', error);
    }
  }, [db]);

  useEffect(() => {
    if (!isReady) return;

    const loadParentItems = async () => {
      try {
        await refetchItems();
      } catch (error) {
        console.error('Failed to load parent items:', error);
      }
    };

    loadParentItems();
  }, [isReady, refetchItems]);

  useEffect(() => {
    if (!db || !parentAccountIdValue) {
      setSuggestedCode('');
      return;
    }

    const suggestCode = async () => {
      try {
        const repository = new CashFlowRepository(db);
        const parentItem = parentItems.find(
          item => item.id === Number(parentAccountIdValue),
        );

        if (!parentItem) return;

        const allCashFlows = await repository.getCashFlowChildren();
        const childrenCodes = allCashFlows
          .filter(item => item.code.startsWith(parentItem.code + '.'))
          .map(item => item.code);

        const suggested = suggestNextCode(parentItem.code, childrenCodes);
        setSuggestedCode(suggested || '');

        if (suggested) {
          setValue('code', suggested);
        }

        setValue('type', String(parentItem.type));
      } catch (error) {
        console.error('Failed to suggest code:', error);
      }
    };

    suggestCode();
  }, [db, parentAccountIdValue, parentItems, setValue]);

  const validateCode = useCallback(
    async (code: string) => {
      if (!code.trim()) {
        return t('errorCodeBeEmpty', {
          ns: CASH_FLOW_FORM_NAMESPACE,
          defaultValue: 'Código não pode estar vazio',
        });
      }

      if (!db || !parentAccountIdValue) {
        return true;
      }

      try {
        const repository = new CashFlowRepository(db);
        const parentItem = parentItems.find(
          item => item.id === Number(parentAccountIdValue),
        );

        if (!parentItem) {
          return true;
        }

        const expectedPrefix = parentItem.code + '.';
        if (!code.startsWith(expectedPrefix)) {
          return t('errorCodePrefix', {
            ns: CASH_FLOW_FORM_NAMESPACE,
            defaultValue: `O código deve começar com "${expectedPrefix}"`,
            expectedPrefix,
          });
        }

        const parentSegments = parentItem.code.split('.');
        const codeSegments = code.split('.');
        const expectedDepth = parentSegments.length + 1;
        if (codeSegments.length !== expectedDepth) {
          return t('errorInvalidCodeFormat', {
            ns: CASH_FLOW_FORM_NAMESPACE,
            defaultValue: `O código deve ter exatamente ${expectedDepth} segmentos (ex: "${expectedPrefix}1")`,
            expectedDepth,
            expectedPrefix,
          });
        }

        const allCashFlows = await repository.getCashFlows();
        const codeExists = allCashFlows.some(item => item.code === code);
        if (codeExists) {
          return t('errorExistingCode', {
            ns: CASH_FLOW_FORM_NAMESPACE,
            defaultValue: 'Já existe uma conta com este código',
          });
        }

        return true;
      } catch (error) {
        console.error('Code validation error:', error);
        return true;
      }
    },
    [db, parentAccountIdValue, parentItems],
  );

  const onSubmit = useCallback(
    async (data: CashFlowFormData) => {
      if (!db) return false;

      setIsLoading(true);
      try {
        const repository = new CashFlowRepository(db);

        await repository.insertCashFlow({
          code: data.code,
          title: data.title,
          type: Number(data.type),
          parentAccountId: Number(data.parentAccountId),
          acceptsEntries: Number(data.acceptsEntries),
        });

        showAlert({
          title: 'Success',
          message: 'Account created successfully',
          type: 'success',
        });

        reset();
        goBack();
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

  const loadItems = async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      const repository = new CashFlowRepository(db);
      const data = await repository.getCashFlowAbleToBeParent();
      const flowTypes = await repository.getFlowTypes();
      setFlowTypes(flowTypes);
      setParentItems(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Failed to load items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptsEntriesOptions: SelectOption[] = useMemo(
    () => [
      { label: 'Sim', value: '1' },
      { label: 'Não', value: '0' },
    ],
    [],
  );

  const formattedFlowTypes: SelectOption[] = useMemo(
    () =>
      flowTypes.map(type => ({
        label: t(type.label, { ns: 'common' }),
        value: String(type.id),
      })),
    [flowTypes, t],
  );

  const formattedParentItems: SelectOption[] = useMemo(
    () =>
      parentItems.map(item => ({
        label: `${item.code} - ${item.title}`,
        value: String(item.id),
      })),
    [parentItems],
  );

  const parentCode = useMemo(() => {
    if (!parentAccountIdValue) return '';
    const parent = parentItems.find(
      item => item.id === Number(parentAccountIdValue),
    );
    return parent ? parent.code : '';
  }, [parentAccountIdValue, parentItems]);

  useEffect(() => {
    if (isReady && db) {
      loadItems();
    }
  }, [isReady, db]);

  return {
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    reset,
    isLoading,
    parentItems: formattedParentItems,
    flowTypes: formattedFlowTypes,
    acceptsEntriesOptions,
    t,
    setValue,
    watch,
    validateCode,
    parentCode,
  };
};
