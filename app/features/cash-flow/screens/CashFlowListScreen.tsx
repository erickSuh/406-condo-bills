import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/styles/colors';
import fonts from '@/styles/fonts';
import { useDatabase } from '@/shared/context/DatabaseContext';

interface CashFlowItem {
  id: number;
  code: string;
  title: string;
  deleted: number;
}

export const CashFlowListScreen: React.FC = () => {
  const { db, isReady } = useDatabase();
  const [items, setItems] = useState<CashFlowItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CashFlowItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load items from database
  useEffect(() => {
    if (isReady && db) {
      loadItems();
    }
  }, [isReady, db]);

  // Filter items based on search query
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
    try {
      const result = await db.getAllAsync<CashFlowItem>(
        'SELECT * FROM cash_flow WHERE deleted = 0 ORDER BY code',
      );
      setItems(result || []);
    } catch (error) {
      console.error('Failed to load items:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!db) return;
    try {
      await db.runAsync('UPDATE cash_flow SET deleted = 1 WHERE id = ?', [id]);
      loadItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const getCodeColor = (code: string): string => {
    const firstDigit = code.charAt(0);
    return firstDigit === '1' ? colors.green : colors.red;
  };

  const renderItem = ({ item }: { item: CashFlowItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={[styles.itemCode, { color: getCodeColor(item.code) }]}>
          {item.code}
        </Text>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteButton}
      >
        <Ionicons
          name="trash-outline"
          size={20}
          color={colors.icon_light_gray}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Plano de Contas</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={28} color={colors.font_inverse} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.font_caption} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar conta"
            placeholderTextColor={colors.font_caption}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>Listagem</Text>
          <Text style={styles.listHeaderCount}>
            {filteredItems.length} registros
          </Text>
        </View>

        {/* List */}
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
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
    backgroundColor: colors.background_secondary,
  },
  header: {
    backgroundColor: colors.background_primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.font_inverse,
    fontFamily: fonts.heading,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background_secondary,
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.font_primary,
    fontFamily: fonts.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.font_label,
    fontFamily: fonts.heading,
  },
  listHeaderCount: {
    fontSize: 12,
    color: colors.font_caption,
    fontFamily: fonts.primary,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.font_inverse,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  itemContent: {
    flex: 1,
  },
  itemCode: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: fonts.heading,
  },
  itemTitle: {
    fontSize: 14,
    color: colors.font_primary,
    fontFamily: fonts.primary,
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: colors.font_caption,
    fontFamily: fonts.primary,
  },
});
