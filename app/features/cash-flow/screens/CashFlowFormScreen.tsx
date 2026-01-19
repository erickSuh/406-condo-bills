import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import spaces from '@/styles/spaces';
import { Header, Input, Load } from '@/shared/components';
import { Select } from '@/shared/components/Select';
import { useCashFlowFormScreen } from '../hooks/useCashFlowFormScreen';
import { CASH_FLOW_FORM_NAMESPACE } from '../constants';

export const CashFlowFormScreen: React.FC = () => {
  const {
    control,
    errors,
    handleSubmit,
    isLoading,
    parentItems,
    flowTypes,
    acceptsEntriesOptions,
    watch,
    validateCode,
    parentCode,
    t,
  } = useCashFlowFormScreen();

  const parentAccountId = watch('parentAccountId');
  const isTypeDisabled = !!parentAccountId;

  // Memoize form data to avoid unnecessary re-renders
  const formData = useMemo(
    () => ({
      parentAccountId,
      isTypeDisabled,
      parentCode,
      validateCode,
    }),
    [parentAccountId, isTypeDisabled, parentCode, validateCode],
  );

  if (isLoading) {
    return <Load />;
  }

  // Form sections rendered as FlatList items
  const renderFormContent = () => (
    <>
      <View style={styles.formSection}>
        <Text style={styles.label}>
          {t('parentAccount', {
            defaultValue: 'Conta pai',
            ns: CASH_FLOW_FORM_NAMESPACE,
          })}
        </Text>
        <Controller
          control={control}
          name="parentAccountId"
          render={({ field: { value, onChange } }) => (
            <Select
              options={parentItems}
              value={value}
              onValueChange={onChange}
              placeholder={t('selectParentAccount', {
                defaultValue: 'Selecione a conta',
                ns: CASH_FLOW_FORM_NAMESPACE,
              })}
            />
          )}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>
          {t('code', {
            defaultValue: 'Código',
            ns: CASH_FLOW_FORM_NAMESPACE,
          })}
        </Text>
        <Controller
          control={control}
          name="code"
          rules={{
            required: 'Code is required',
            validate: formData.validateCode,
          }}
          render={({ field: { value, onChange } }) => {
            const prefix = formData.parentCode ? `${formData.parentCode}.` : '';
            const handleCodeChange = (text: string) => {
              if (prefix && !text.startsWith(prefix)) {
                onChange(prefix);
              } else {
                onChange(text);
              }
            };

            return (
              <>
                <Input
                  placeholder={t('codePlaceholder', {
                    defaultValue: 'Ex: 1.1',
                    ns: CASH_FLOW_FORM_NAMESPACE,
                  })}
                  value={value || prefix}
                  onChangeText={handleCodeChange}
                  maxLength={20}
                />
                {errors.code && (
                  <Text style={styles.error}>{errors.code.message}</Text>
                )}
              </>
            );
          }}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>
          {t('name', { defaultValue: 'Nome', ns: CASH_FLOW_FORM_NAMESPACE })}
        </Text>
        <Controller
          control={control}
          name="title"
          rules={{
            required: t('errorRequiredField', {
              defaultValue: 'Este campo é obrigatório',
              ns: CASH_FLOW_FORM_NAMESPACE,
            }),
          }}
          render={({ field: { value, onChange } }) => (
            <>
              <Input
                placeholder={t('namePlaceholder', {
                  defaultValue: 'Nome da conta',
                  ns: CASH_FLOW_FORM_NAMESPACE,
                })}
                value={value}
                onChangeText={onChange}
                maxLength={120}
              />
              {errors.title && (
                <Text style={styles.error}>{errors.title.message}</Text>
              )}
            </>
          )}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>
          {t('type', { defaultValue: 'Tipo', ns: CASH_FLOW_FORM_NAMESPACE })}
        </Text>
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <Select
              options={flowTypes}
              value={value}
              onValueChange={onChange}
              placeholder={t('selectType', {
                defaultValue: 'Select type',
                ns: CASH_FLOW_FORM_NAMESPACE,
              })}
              editable={!formData.isTypeDisabled}
            />
          )}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>
          {t('acceptsEntries', {
            defaultValue: 'Aceita lançamentos',
            ns: CASH_FLOW_FORM_NAMESPACE,
          })}
        </Text>
        <Controller
          control={control}
          name="acceptsEntries"
          render={({ field: { value, onChange } }) => (
            <Select
              options={acceptsEntriesOptions}
              value={value}
              onValueChange={onChange}
              placeholder={t('selectAcceptsEntries', {
                defaultValue: 'Select',
                ns: CASH_FLOW_FORM_NAMESPACE,
              })}
            />
          )}
        />
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Header
          title={t('title', {
            defaultValue: 'Inserir Conta',
            ns: CASH_FLOW_FORM_NAMESPACE,
          })}
          icon="checkmark"
          callToAction={handleSubmit}
          showGoBack
        />
      </View>

      <FlatList
        scrollEnabled={true}
        data={[{ key: 'form' }]}
        renderItem={() => renderFormContent()}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_primary,
  },
  header: {
    paddingHorizontal: spaces.large,
    paddingTop: spaces.base,
  },
  scrollContent: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: colors.background_secondary,
    paddingHorizontal: 24,
    paddingVertical: spaces.base,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  formSection: {
    marginBottom: spaces.small,
  },
  label: {
    fontSize: fonts.sizes.base,
    fontFamily: fonts.label,
    color: colors.font_label,
    marginBottom: spaces.small,
  },
  error: {
    fontSize: 12,
    color: colors.red,
    marginTop: spaces.small,
  },
  buttonSection: {
    flexDirection: 'row',
    gap: spaces.base,
    marginTop: spaces.large,
    marginBottom: spaces.large,
  },
});
