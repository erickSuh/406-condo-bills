import { useState, useCallback } from 'react';
import { CashFlowRepository } from '../api';
import { useDatabase } from '@/shared/context/DatabaseContext';
import { CashFlowItem } from '../types';

export const useCashFlowListDelete = (
  onDeleteSuccess: (deletedIds: number[]) => void,
) => {
  const { db } = useDatabase();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<CashFlowItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<Error | null>(null);

  const handleDeletePress = useCallback((item: CashFlowItem) => {
    setItemToDelete(item);
    setDeleteConfirmVisible(true);
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!db) return;
      setIsDeleting(true);
      try {
        const repository = new CashFlowRepository(db);
        const childrenIds = await repository.getAllChildrenRecursive(id);
        const idsToRemove = [id, ...childrenIds];

        await repository.deleteCashFlow(id);
        onDeleteSuccess(idsToRemove);
        setDeleteError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setDeleteError(error);
        console.error('Failed to delete item:', error);
      } finally {
        setIsDeleting(false);
      }
    },
    [db, onDeleteSuccess],
  );

  const confirmDelete = useCallback(() => {
    if (itemToDelete !== null) {
      handleDelete(itemToDelete.id);
      setDeleteConfirmVisible(false);
      setTimeout(() => {
        setItemToDelete(null);
      }, 300);
    }
  }, [itemToDelete, handleDelete]);

  const cancelDelete = useCallback(() => {
    setDeleteConfirmVisible(false);
    setTimeout(() => {
      setItemToDelete(null);
    }, 300);
  }, []);

  return {
    deleteConfirmVisible,
    itemToDelete,
    isDeleting,
    deleteError,
    handleDeletePress,
    handleDelete,
    confirmDelete,
    cancelDelete,
  };
};
