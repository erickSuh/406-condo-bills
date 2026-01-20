import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDatabase } from '@/shared/context/DatabaseContext';
import { CashFlowRepository } from '../api';
import { CashFlowItem } from '../types';
import { useTranslation } from 'react-i18next';
import { CASH_FLOW_LIST_NAMESPACE } from '../constants';

export const useCashFlowListScreen = () => {
  const { db, isReady } = useDatabase();
  const [items, setItems] = useState<CashFlowItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { t } = useTranslation(CASH_FLOW_LIST_NAMESPACE);
  const itemsLoadedRef = useRef(false);

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

  const filteredItems = useMemo(() => {
    if (searchQuery.trim() === '') {
      return items;
    }

    const query = searchQuery.toLowerCase();
    return items.filter(
      item =>
        item.code.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query),
    );
  }, [items, searchQuery]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!db) return;
      try {
        const repository = new CashFlowRepository(db);

        const childrenIds = await repository.getAllChildrenRecursive(id);
        const idsToRemove = [id, ...childrenIds];

        await repository.deleteCashFlow(id);

        setItems(current =>
          current.filter(item => !idsToRemove.includes(item.id)),
        );
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        console.error('Failed to delete item:', error);
      }
    },
    [db],
  );

  return {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    handleDelete,
    t,
  };
};
