import { useState, useCallback, useEffect } from 'react';
import { CashFlowRepository } from '../api';
import { useDatabase } from '@/shared/context/DatabaseContext';
import { CashFlowItem, FlowType } from '../types';
import { useSentry } from '@/shared/hooks/useSentry';

export const useCashFlowData = () => {
  const { db, isReady } = useDatabase();
  const { reportError } = useSentry();
  const [isLoading, setIsLoading] = useState(false);
  const [parentItems, setParentItems] = useState<CashFlowItem[]>([]);
  const [flowTypes, setFlowTypes] = useState<FlowType[]>([]);

  const refetchItems = useCallback(async () => {
    if (!db) return;
    try {
      const repository = new CashFlowRepository(db);
      const items = await repository.getCashFlowAbleToBeParent();
      setParentItems(items);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      reportError(err, { hook: 'useCashFlowData', operation: 'refetchItems' });
      console.error('Failed to load parent items:', error);
    }
  }, [db, reportError]);

  const loadItems = useCallback(async () => {
    if (!db) return;
    setIsLoading(true);
    try {
      const repository = new CashFlowRepository(db);
      const data = await repository.getCashFlowAbleToBeParent();
      const types = await repository.getFlowTypes();
      setFlowTypes(types);
      setParentItems(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      reportError(error, { hook: 'useCashFlowData', operation: 'loadItems' });
      console.error('Failed to load items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [db, reportError]);

  useEffect(() => {
    if (!isReady) return;
    loadItems();
  }, [isReady, loadItems]);

  return {
    parentItems,
    flowTypes,
    isLoading,
    refetchItems,
  };
};
