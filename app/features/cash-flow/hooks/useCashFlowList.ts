import { useState, useEffect } from 'react';
import { useDatabase } from '@/shared/context/DatabaseContext';
import { CashFlowRepository } from '../api';
import { CashFlowItem } from '../types';

export const useCashFlowList = () => {
  const { db, isReady } = useDatabase();
  const [items, setItems] = useState<CashFlowItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CashFlowItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isReady && db) {
      loadItems();
    }
  }, [isReady, db]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter(
          item =>
            item.code.toLowerCase().includes(query) ||
            item.title.toLowerCase().includes(query),
        ),
      );
    }
  }, [searchQuery, items]);

  const loadItems = async () => {
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
  };

  const handleDelete = async (id: number) => {
    if (!db) return;
    try {
      const repository = new CashFlowRepository(db);
      await repository.deleteCashFlow(id);
      await loadItems();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Failed to delete item:', error);
    }
  };

  return {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    handleDelete,
  };
};
