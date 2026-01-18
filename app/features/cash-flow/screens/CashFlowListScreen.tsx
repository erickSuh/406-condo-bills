import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import { Input, FixedDialogCard, Header } from '@/shared/components';
import { useCashFlowList } from '../hooks/useCashFlowList';
import { CashFlowItem } from '../types';
import spaces from '@/styles/spaces';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/routes/types';

export const CashFlowListScreen: React.FC = () => {
  const { t } = useTranslation('cashFlowListScreen');
  const { navigate } = useNavigation<RootStackNavigationProp>();
  const { filteredItems, searchQuery, setSearchQuery, handleDelete } =
    useCashFlowList();

  const getCodeColor = (code: number): string => {
    return code === 0 ? colors.green : colors.red;
  };

  const handleNavigateToForm = useCallback(() => {
    navigate('CashFlowFormScreen');
  }, [navigate]);

  const renderItem = ({ item }: { item: CashFlowItem }) => (
    <FixedDialogCard
      code={item.code}
      title={item.title}
      codeColor={getCodeColor(item.type)}
      onDelete={() => handleDelete(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Header
          title={t('title')}
          icon="add"
          callToAction={handleNavigateToForm}
        />

        <Input
          placeholder={t('searchInputPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={'search'}
          maxLength={120}
          style={styles.headerInput}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>{t('listHeader')}</Text>
          <Text style={styles.listHeaderCount}>
            {t('listHeaderRegistryCount', {
              count: filteredItems.length,
            })}
          </Text>
        </View>

        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={true}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('emptyListMessage')}</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerInput: {
    borderRadius: 100,
    height: 56,
    marginBottom: 20,
    marginTop: 12,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: colors.background_secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spaces.large,
  },
  listHeaderTitle: {
    fontSize: 20,
    color: colors.font_header,
    fontFamily: fonts.heading,
  },
  listHeaderCount: {
    fontSize: fonts.sizes.base,
    color: colors.font_caption,
    fontFamily: fonts.listItemCount,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: fonts.sizes.base,
    color: colors.font_caption,
    fontFamily: fonts.primary,
  },
});
