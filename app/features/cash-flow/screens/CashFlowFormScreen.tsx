import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import spaces from '@/styles/spaces';
import { Header, Input, Button, Load } from '@/shared/components';
import { Select, SelectOption } from '@/shared/components/Select';
import { useCashFlowForm } from '../hooks/useCashFlowForm';

export const CashFlowFormScreen: React.FC = () => {
  const { t } = useTranslation('cashFlowFormScreen');
  const { control, errors, handleSubmit, isLoading } = useCashFlowForm();

  const parentAccountOptions: SelectOption[] = useMemo(
    () => [
      { label: '1 - Receitas', value: '1' },
      { label: '2 - Despesas', value: '2' },
    ],
    [],
  );

  const typeOptions: SelectOption[] = useMemo(
    () => [
      { label: 'Receita', value: '0' },
      { label: 'Despesa', value: '1' },
    ],
    [],
  );

  const acceptsEntriesOptions: SelectOption[] = useMemo(
    () => [
      { label: 'Sim', value: '1' },
      { label: 'Não', value: '0' },
    ],
    [],
  );

  const handleFormSubmit = handleSubmit;

  if (isLoading) {
    return <Load />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Header
          title={t('title', { defaultValue: 'Inserir Conta' })}
          icon="checkmark"
          callToAction={handleFormSubmit}
        />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formSection}>
          <Text style={styles.label}>
            {t('parentAccount', { defaultValue: 'Conta pai' })}
          </Text>
          <Controller
            control={control}
            name="parentAccountId"
            render={({ field: { value, onChange } }) => (
              <Select
                options={parentAccountOptions}
                value={value}
                onValueChange={onChange}
                placeholder={t('selectParentAccount', {
                  defaultValue: 'Select parent account',
                })}
              />
            )}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>
            {t('code', { defaultValue: 'Código' })}
          </Text>
          <Controller
            control={control}
            name="code"
            rules={{ required: 'Code is required' }}
            render={({ field: { value, onChange } }) => (
              <>
                <Input
                  placeholder={t('codePlaceholder', {
                    defaultValue: 'Ex: 1.1',
                  })}
                  value={value}
                  onChangeText={onChange}
                  maxLength={20}
                />
                {errors.code && (
                  <Text style={styles.error}>{errors.code.message}</Text>
                )}
              </>
            )}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>
            {t('name', { defaultValue: 'Nome' })}
          </Text>
          <Controller
            control={control}
            name="title"
            rules={{ required: 'Name is required' }}
            render={({ field: { value, onChange } }) => (
              <>
                <Input
                  placeholder={t('namePlaceholder', {
                    defaultValue: 'Account name',
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
            {t('type', { defaultValue: 'Tipo' })}
          </Text>
          <Controller
            control={control}
            name="type"
            render={({ field: { value, onChange } }) => (
              <Select
                options={typeOptions}
                value={value}
                onValueChange={onChange}
                placeholder={t('selectType', { defaultValue: 'Select type' })}
              />
            )}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>
            {t('acceptsEntries', { defaultValue: 'Aceita lançamentos' })}
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
                })}
              />
            )}
          />
        </View>

        <View style={styles.buttonSection}>
          <Button
            title={t('cancel', { defaultValue: 'Cancel' })}
            variant="secondary"
            onPress={() => handleSubmit(async () => {})}
          />
          <Button
            title={t('save', { defaultValue: 'Save' })}
            variant="primary"
            onPress={handleFormSubmit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_primary,
  },
  header: {
    backgroundColor: colors.background_primary,
    paddingHorizontal: spaces.base,
    paddingVertical: spaces.base,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spaces.base,
    paddingVertical: spaces.base,
  },
  formSection: {
    marginBottom: spaces.large,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.heading,
    color: colors.font_header,
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
