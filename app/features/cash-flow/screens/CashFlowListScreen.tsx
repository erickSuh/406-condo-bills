import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import { Input, FixedDialogCard, Header, Button } from '@/shared/components';
import { useCashFlowListScreen } from '../hooks/useCashFlowListScreen';
import { CashFlowItem } from '../types';
import spaces from '@/styles/spaces';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '@/routes/types';
import { borderRadius } from '@/styles/borderRadius';

export const CashFlowListScreen: React.FC = () => {
  const { navigate } = useNavigation<RootStackNavigationProp>();
  const { filteredItems, searchQuery, setSearchQuery, handleDelete, t } =
    useCashFlowListScreen();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const getCodeColor = (code: number): string => {
    return code === 0 ? colors.green : colors.orange;
  };

  const handleNavigateToForm = useCallback(() => {
    navigate('CashFlowFormScreen');
  }, [navigate]);

  const handleDeletePress = (itemId: number) => {
    setItemToDelete(itemId);
    setDeleteConfirmVisible(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      handleDelete(itemToDelete);
      setDeleteConfirmVisible(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
    setItemToDelete(null);
  };

  const renderItem = ({ item }: { item: CashFlowItem }) => (
    <FixedDialogCard
      code={item.code}
      title={item.title}
      codeColor={getCodeColor(item.type)}
      onDelete={() => handleDeletePress(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Header
          title={t('title', { ns: 'cashFlowListScreen' })}
          icon="add"
          callToAction={handleNavigateToForm}
        />

        <Input
          placeholder={t('searchInputPlaceholder', {
            ns: 'cashFlowListScreen',
          })}
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon={'search'}
          maxLength={120}
          style={styles.headerInput}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>
            {t('listHeader', { ns: 'cashFlowListScreen' })}
          </Text>
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
              <Text style={styles.emptyText}>
                {t('emptyListMessage', { ns: 'cashFlowListScreen' })}
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
              <Ionicons name="trash" size={48} color={colors.red} />
            </View>
            <Text style={styles.deleteModalTitle}>
              {t('deleteConfirmTitle', {
                defaultValue: 'Deseja excluir a conta?',
                ns: 'cashFlowListScreen',
              })}
            </Text>
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
    marginBottom: spaces.base,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontFamily: fonts.heading,
    color: colors.font_primary,
    marginBottom: spaces.large,
    textAlign: 'center',
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: spaces.base,
    width: '100%',
  },
  deleteButton: {
    flex: 1,
    borderRadius: borderRadius.medium,
  },
});
