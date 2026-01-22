import { useForm } from 'react-hook-form';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/routes/types';
import { SelectOption } from '@/shared/components';
import { useTranslation } from 'react-i18next';
import { CASH_FLOW_FORM_NAMESPACE } from '../constants';
import { useCashFlowData } from './useCashFlowData';
import { useCashFlowCodeSuggestion } from './useCashFlowCodeSuggestion';
import { useCashFlowValidation } from './useCashFlowValidation';
import { useCashFlowSubmit } from './useCashFlowSubmit';
import { useDatabase } from '@/shared/context/DatabaseContext';

type CashFlowFormScreenRouteProp = RouteProp<
  RootStackParamList,
  'CashFlowFormScreen'
>;

export interface CashFlowFormData {
  parentAccountId: string | number;
  code: string;
  title: string;
  type: string | number;
  acceptsEntries: string | number;
}

export const useCashFlowFormScreen = () => {
  let route: CashFlowFormScreenRouteProp | undefined;
  try {
    const routeFromHook = useRoute<CashFlowFormScreenRouteProp>();
    route = routeFromHook;
  } catch {
    // Route hook not available outside navigator context (e.g., in tests)
  }

  const [isReadOnly] = useState(route?.params?.isReadOnly ?? false);
  const itemToView = route?.params?.item;
  const { t } = useTranslation([CASH_FLOW_FORM_NAMESPACE, 'common']);
  const navigation = useNavigation<NavigationProp<any>>();
  const { isReady } = useDatabase();

  const {
    parentItems: fetchedParentItems,
    flowTypes,
    isLoading,
    refetchItems,
  } = useCashFlowData();
  const { suggestCode } = useCashFlowCodeSuggestion();
  const { validateCode: validateCodeHook, validateTitle: validateTitleHook } =
    useCashFlowValidation();
  const { submitCashFlow } = useCashFlowSubmit(navigation);

  const [suggestedPrefix, setSuggestedPrefix] = useState<string>('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CashFlowFormData>({
    defaultValues: {
      parentAccountId: undefined,
      code: '',
      title: '',
      type: '0',
      acceptsEntries: 0,
    },
  });

  const parentAccountIdValue = watch('parentAccountId');

  const isTypeDisabled = useMemo(() => {
    return !!parentAccountIdValue;
  }, [parentAccountIdValue]);

  useEffect(() => {
    if (!isReady) return;
    refetchItems();
  }, [isReady, refetchItems]);

  useEffect(() => {
    if (isReadOnly) {
      return;
    }

    const handleCodeSuggestion = async () => {
      try {
        const parentItem = parentAccountIdValue
          ? fetchedParentItems.find(
              item => item.id === Number(parentAccountIdValue),
            )
          : undefined;

        const { code, prefix } = await suggestCode(parentItem);
        if (code) {
          setValue('code', code);
          setSuggestedPrefix(prefix);
          if (parentItem) {
            setValue('type', String(parentItem.type));
          }
        }
      } catch (error) {
        console.error('Failed to suggest code:', error);
      }
    };

    handleCodeSuggestion();
  }, [
    parentAccountIdValue,
    fetchedParentItems,
    setValue,
    isReadOnly,
    suggestCode,
  ]);

  const validateCode = useCallback(
    async (code: string) => {
      const error = await validateCodeHook(
        code,
        String(parentAccountIdValue),
        fetchedParentItems,
        suggestedPrefix ? suggestedPrefix.slice(0, -1) : undefined,
      );
      return error;
    },
    [
      fetchedParentItems,
      parentAccountIdValue,
      validateCodeHook,
      suggestedPrefix,
    ],
  );

  const onSubmit = useCallback(
    async (data: CashFlowFormData) => {
      await submitCashFlow(
        {
          code: data.code.trim(),
          title: data.title.trim(),
          type: Number(data.type),
          parentAccountId: Number(data.parentAccountId),
          acceptsEntries: Number(data.acceptsEntries),
        },
        refetchItems,
      );
    },
    [submitCashFlow, refetchItems],
  );

  const acceptsEntriesOptions: SelectOption[] = useMemo(
    () => [
      { label: 'Sim', value: 1 },
      { label: 'Não', value: 0 },
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

  const formattedParentItems: SelectOption[] = useMemo(() => {
    const formattedParents = fetchedParentItems.map(item => ({
      label: `${item.code} - ${item.title}`,
      value: String(item.id),
    }));
    formattedParents.unshift({
      label: t('noParentAccount', {
        defaultValue: 'Sem conta pai',
        ns: CASH_FLOW_FORM_NAMESPACE,
      }),
      value: '',
    });
    return formattedParents;
  }, [fetchedParentItems, t]);

  useEffect(() => {
    if (itemToView && isReadOnly) {
      setValue('code', itemToView.code);
      setValue('title', itemToView.title);
      setValue('type', String(itemToView.type));
      setValue('parentAccountId', String(itemToView.parent_id));
      setValue('acceptsEntries', itemToView.accepts_entries);
    }
  }, [itemToView, isReadOnly, setValue]);

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
    watch,
    validateCode,
    validateTitle: validateTitleHook,
    suggestedPrefix,
    isTypeDisabled,
    isReadOnly,
    itemToView,
  };
};
