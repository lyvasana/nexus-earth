import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { useInventory } from '../services/useInventory';
import { InventoryCard } from '../components/InventoryCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { InventoryItem } from '../types';

const OPERATOR_ID = 'demo-operator-id';

const FILTER_TABS = ['all', 'weapon', 'armor', 'cyber_cell', 'consumable'];

export default function InventoryScreen() {
  const { inventory, loading, equipItem, unequipItem, dropItem } = useInventory(OPERATOR_ID);
  const [activeFilter, setActiveFilter] = useState('all');

  if (loading) return <LoadingScreen message="Loading field kit..." />;

  const filtered = activeFilter === 'all'
    ? inventory
    : inventory.filter(i => i.item_type === activeFilter);

  const handleEquip = (item: InventoryItem) => {
    if (item.is_equipped) {
      unequipItem(item.id);
    } else {
      equipItem(item.id);
    }
  };

  const handleDrop = (item: InventoryItem) => {
    Alert.alert(
      'Drop Item',
      `Permanently discard ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Drop', style: 'destructive', onPress: () => dropItem(item.id) },
      ]
    );
  };

  const equippedCount = inventory.filter(i => i.is_equipped).length;

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.statsBar}>
        <Text style={styles.stat}>📦 {inventory.length} items</Text>
        <Text style={styles.stat}>⚔️ {equippedCount} equipped</Text>
        <Text style={styles.stat}>📥 Capacity: {inventory.length}/50</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, activeFilter === tab && styles.activeTab]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterText, activeFilter === tab && styles.activeTabText]}>
              {tab.toUpperCase().replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Item List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <InventoryCard
            item={item}
            onEquip={handleEquip}
            onDrop={handleDrop}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>No items in this category.</Text>
            <Text style={styles.emptyHint}>Explore nodes to find gear.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  stat: { ...theme.typography.caption, color: theme.colors.textMuted },
  filterRow: {
    flexDirection: 'row',
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterTab: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: theme.colors.accent,
  },
  filterText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontSize: 9,
  },
  activeTabText: {
    color: theme.colors.background,
  },
  listContent: { padding: theme.spacing.md },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: theme.spacing.sm,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { ...theme.typography.bodyBold, color: theme.colors.textMuted },
  emptyHint: { ...theme.typography.caption, color: theme.colors.textMuted, fontStyle: 'italic' },
});
