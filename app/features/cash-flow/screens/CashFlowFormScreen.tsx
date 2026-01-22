import React, { useCallback } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import spaces from '@/styles/spaces';
import { Header, Input } from '@/shared/components';
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
    validateCode,
    validateTitle,
    suggestedPrefix,
    t,
    isTypeDisabled,
    isReadOnly,
    itemToView,
  } = useCashFlowFormScreen();

  const renderFormContent = useCallback(
    () => (
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
                onValueChange={isReadOnly ? () => {} : onChange}
                placeholder={t('selectParentAccount', {
                  defaultValue: 'Selecione a conta pai',
                  ns: CASH_FLOW_FORM_NAMESPACE,
                })}
                editable={!isReadOnly}
                accessibilityHint={t('selectParentAccount', {
                  defaultValue: 'Selecione a conta pai',
                  ns: CASH_FLOW_FORM_NAMESPACE,
                })}
              />
            )}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label} nativeID="code-label">
            {t('code', {
              defaultValue: 'Código',
              ns: CASH_FLOW_FORM_NAMESPACE,
            })}
          </Text>
          <Controller
            control={control}
            name="code"
            rules={{
              required: t('errorRequiredField', {
                defaultValue: 'Este campo é obrigatório',
                ns: CASH_FLOW_FORM_NAMESPACE,
              }),
              validate: validateCode,
            }}
            render={({ field: { value, onChange } }) => {
              const newValue = value
                .replaceAll(',', '.')
                .replaceAll(/[^0-9.]/g, '');

              const handleCodeChange = (text: string) => {
                if (isReadOnly) {
                  return;
                }

                if (suggestedPrefix && !text.startsWith(suggestedPrefix)) {
                  onChange(suggestedPrefix);
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
                    value={newValue || suggestedPrefix}
                    onChangeText={!isReadOnly ? handleCodeChange : undefined}
                    maxLength={23}
                    editable={!isReadOnly}
                    keyboardType="numeric"
                    accessibilityLabelledBy={'code-label'}
                    accessibilityLabel={t('code', {
                      defaultValue: 'Código',
                      ns: CASH_FLOW_FORM_NAMESPACE,
                    })}
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
          <Text style={styles.label} nativeID="name-label">
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
              validate: validateTitle,
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
                  editable={!isReadOnly}
                  accessibilityLabelledBy={'name-label'}
                  accessibilityHint={t('namePlaceholder', {
                    defaultValue: 'Nome da conta',
                    ns: CASH_FLOW_FORM_NAMESPACE,
                  })}
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
                onValueChange={
                  isTypeDisabled || isReadOnly ? () => {} : onChange
                }
                placeholder={t('selectType', {
                  defaultValue: 'Select type',
                  ns: CASH_FLOW_FORM_NAMESPACE,
                })}
                editable={!isTypeDisabled && !isReadOnly}
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
                onValueChange={isReadOnly ? () => {} : onChange}
                placeholder={t('selectAcceptsEntries', {
                  defaultValue: 'Select',
                  ns: CASH_FLOW_FORM_NAMESPACE,
                })}
                editable={!isReadOnly}
                accessibilityHint={t('selectAcceptsEntries', {
                  defaultValue: 'Select',
                  ns: CASH_FLOW_FORM_NAMESPACE,
                })}
              />
            )}
          />
        </View>
      </>
    ),
    [
      t,
      control,
      errors,
      parentItems,
      flowTypes,
      acceptsEntriesOptions,
      isReadOnly,
      suggestedPrefix,
      isTypeDisabled,
      validateCode,
      validateTitle,
    ],
  );

  if (isLoading) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Header
          title={
            itemToView && isReadOnly
              ? t('titleEdit', {
                  defaultValue: 'Visualizar Conta',
                  ns: CASH_FLOW_FORM_NAMESPACE,
                })
              : t('title', {
                  defaultValue: 'Inserir Conta',
                  ns: CASH_FLOW_FORM_NAMESPACE,
                })
          }
          icon={isReadOnly ? undefined : 'done'}
          callToAction={isReadOnly ? undefined : handleSubmit}
          showGoBack
        />
      </View>

      <FlatList
        scrollEnabled={true}
        data={[{ key: 'form' }]}
        renderItem={renderFormContent}
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
    paddingTop: spaces.xLarge,
    backgroundColor: colors.background_secondary,
    paddingHorizontal: spaces.large,
    paddingVertical: spaces.base,
    borderTopLeftRadius: spaces.large,
    borderTopRightRadius: spaces.large,
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
