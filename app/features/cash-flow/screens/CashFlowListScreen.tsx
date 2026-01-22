import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SvgIcon,
  Input,
  FixedDialogCard,
  Header,
  Button,
} from '@/shared/components';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import { useCashFlowListScreen } from '../hooks/useCashFlowListScreen';
import { CashFlowItem } from '../types';
import spaces from '@/styles/spaces';
import { borderRadius } from '@/styles/borderRadius';
import { getCodeColor } from '../utils/getCodeColor';

export const CashFlowListScreen: React.FC = () => {
  const {
    filteredItems,
    searchQuery,
    setSearchQuery,
    t,
    deleteConfirmVisible,
    itemToDelete,
    handleNavigateToForm,
    handleCardPress,
    handleDeletePress,
    confirmDelete,
    cancelDelete,
  } = useCashFlowListScreen();

  const renderItem = ({ item }: { item: CashFlowItem }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)}>
      <FixedDialogCard
        code={item.code}
        title={item.title}
        codeColor={getCodeColor(item.type)}
        onDelete={() => handleDeletePress(item)}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Header
          title={t('title', {
            ns: 'cashFlowListScreen',
            defaultValue: 'Plano de Contas',
          })}
          icon="add"
          callToAction={handleNavigateToForm}
        />

        <Input
          testID={'search-input'}
          placeholder={t('searchInputPlaceholder', {
            ns: 'cashFlowListScreen',
            defaultValue: 'Pesquisar conta',
          })}
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={'search'}
          maxLength={120}
          style={styles.headerInput}
          accessibilityLabel={t('searchInputPlaceholder', {
            ns: 'cashFlowListScreen',
            defaultValue: 'Pesquisar conta',
          })}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>
            {t('listHeader', {
              ns: 'cashFlowListScreen',
              defaultValue: 'Listagem',
            })}
          </Text>
          <Text style={styles.listHeaderCount}>
            {t('listHeaderRegistryCount', {
              count: filteredItems.length,
              ns: 'cashFlowListScreen',
              defaultValue: `${filteredItems.length} registros`,
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
              <Text style={styles.emptyText}>
                {t('emptyListMessage', {
                  ns: 'cashFlowListScreen',
                  defaultValue: 'Nenhuma conta encontrada',
                })}
              </Text>
            </View>
          }
        />
      </View>

      <Modal
        visible={deleteConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={cancelDelete}
        >
          <View style={styles.deleteModalContainer}>
            <View style={styles.deleteIconContainer}>
              <SvgIcon name="trash" size={48} color={colors.red} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.deleteModalTitle}>
                {t('deleteConfirmTitle', {
                  accountLabel: itemToDelete
                    ? `${itemToDelete.code} - ${itemToDelete.title}`
                    : '',
                  defaultValue: 'Deseja excluir a conta',
                  ns: 'cashFlowListScreen',
                })}
                {'\n'}
                <Text style={styles.deleteModalItem}>
                  {` ${itemToDelete?.code} - ${itemToDelete?.title}`}
                </Text>
                ?
              </Text>
            </View>
            <View style={styles.deleteModalButtons}>
              <Button
                title={t('deleteCancel', {
                  defaultValue: 'Não!',
                  ns: 'cashFlowListScreen',
                })}
                variant="tertiary"
                color={colors.red}
                style={styles.deleteButton}
                onPress={cancelDelete}
              />
              <Button
                title={t('deleteConfirm', {
                  defaultValue: 'Com certeza',
                  ns: 'cashFlowListScreen',
                })}
                variant="primary"
                color={colors.red}
                style={styles.deleteButton}
                onPress={confirmDelete}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    borderRadius: borderRadius.full,
    height: 56,
    marginBottom: spaces.large,
    marginTop: spaces.base,
    paddingHorizontal: spaces.large,
  },
  content: {
    flex: 1,
    paddingHorizontal: spaces.large,
    paddingTop: spaces.base,
    backgroundColor: colors.background_secondary,
    borderTopLeftRadius: borderRadius.medium,
    borderTopRightRadius: borderRadius.medium,
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
    paddingVertical: spaces.large,
  },
  emptyText: {
    fontSize: fonts.sizes.base,
    color: colors.font_caption,
    fontFamily: fonts.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContainer: {
    backgroundColor: colors.font_inverse,
    borderRadius: borderRadius.small,
    paddingHorizontal: spaces.large,
    paddingVertical: 32,
    alignItems: 'center',
    width: '85%',
  },
  deleteIconContainer: {
    marginBottom: spaces.large,
  },
  deleteModalTitle: {
    fontSize: fonts.sizes.base,
    lineHeight: 25,
    fontFamily: fonts.modalDeleteTitle,
    color: colors.font_primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteModalItem: {
    fontFamily: fonts.modalDeleteTitleBold,
  },
  deleteModalButtons: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: spaces.base,
    marginHorizontal: spaces.small,
  },
  deleteButton: {
    borderRadius: borderRadius.medium,
    paddingHorizontal: spaces.xLarge,
  },
});
