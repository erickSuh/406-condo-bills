import { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDatabase } from '@/shared/context/DatabaseContext';
import { CashFlowRepository } from '../api';
import { CashFlowItem } from '../types';
import { useTranslation } from 'react-i18next';
import { CASH_FLOW_LIST_NAMESPACE } from '../constants';
import { useCashFlowListSearch } from './useCashFlowListSearch';
import { useCashFlowListDelete } from './useCashFlowListDelete';
import { useCashFlowListNavigation } from './useCashFlowListNavigation';

export const useCashFlowListScreen = () => {
  const { db, isReady } = useDatabase();
  const [items, setItems] = useState<CashFlowItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation(CASH_FLOW_LIST_NAMESPACE);
  const itemsLoadedRef = useRef(false);

  const { searchQuery, setSearchQuery, filteredItems } =
    useCashFlowListSearch(items);

  const handleDeleteSuccess = useCallback((deletedIds: number[]) => {
    setItems(current => current.filter(item => !deletedIds.includes(item.id)));
  }, []);
  const {
    deleteConfirmVisible,
    itemToDelete,
    isDeleting,
    deleteError,
    handleDeletePress,
    confirmDelete,
    cancelDelete,
  } = useCashFlowListDelete(handleDeleteSuccess);

  const { handleNavigateToForm, handleCardPress } = useCashFlowListNavigation();

  const refetchItems = useCallback(async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      const repository = new CashFlowRepository(db);
      const data = await repository.getCashFlows();
      setItems(data);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Failed to load items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [db]);

  useEffect(() => {
    if (!isReady || !db || itemsLoadedRef.current) return;

    const loadItems = async () => {
      itemsLoadedRef.current = true;
      await refetchItems();
    };

    loadItems();
  }, [db, isReady, refetchItems]);

  useFocusEffect(
    useCallback(() => {
      if (itemsLoadedRef.current) {
        refetchItems();
      }
    }, [refetchItems]),
  );

  return {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    t,
    deleteConfirmVisible,
    itemToDelete,
    isDeleting,
    deleteError,
    handleNavigateToForm,
    handleCardPress,
    handleDeletePress,
    confirmDelete,
    cancelDelete,
  };
};
