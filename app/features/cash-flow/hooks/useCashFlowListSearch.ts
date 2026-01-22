import { useState, useMemo } from 'react';
import { CashFlowItem } from '../types';

export const useCashFlowListSearch = (items: CashFlowItem[]) => {
  const [searchQuery, setSearchQuery] = useState('');

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

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
  };
};
