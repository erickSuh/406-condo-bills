import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import { Input, FixedDialogCard, Header } from '@/shared/components';
import { useCashFlowList } from '../hooks/useCashFlowList';
import { CashFlowItem } from '../types';
import spaces from '@/styles/spaces';

export const CashFlowListScreen: React.FC = () => {
  const { filteredItems, searchQuery, setSearchQuery, handleDelete } =
    useCashFlowList();

  const getCodeColor = (code: number): string => {
    return code === 0 ? colors.green : colors.red;
  };

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
          title="Plano de Contas"
          icon="add"
          callToAction={() => console.log('Add account')}
        />

        <Input
          placeholder="Pesquisar conta"
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={'search'}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>Listagem</Text>
          <Text style={styles.listHeaderCount}>
            {filteredItems.length} registros
          </Text>
        </View>

        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={true}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma conta encontrada</Text>
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
    marginBottom: spaces.base,
  },
  listHeaderTitle: {
    fontSize: spaces.large,
    fontWeight: '600',
    color: colors.font_label,
    fontFamily: fonts.heading,
  },
  listHeaderCount: {
    fontSize: fonts.sizes.small,
    color: colors.font_caption,
    fontFamily: fonts.primary,
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
