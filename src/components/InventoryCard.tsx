import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { InventoryItem } from '../types';
import { theme } from '../theme/theme';

interface InventoryCardProps {
  item: InventoryItem;
  onEquip?: (item: InventoryItem) => void;
  onDrop?: (item: InventoryItem) => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: '#888888',
  uncommon: '#2ecc71',
  rare: '#3498db',
  epic: '#9b59b6',
  legendary: '#f39c12',
};

const ITEM_TYPE_ICONS: Record<string, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  cyber_cell: '🔋',
  resonance_amplifier: '⚡',
  consumable: '💊',
  key_item: '🔑',
};

export const InventoryCard: React.FC<InventoryCardProps> = ({ item, onEquip, onDrop }) => {
  const rarityColor = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;
  const icon = ITEM_TYPE_ICONS[item.item_type] || '📜';

  return (
    <View style={[styles.container, { borderLeftColor: rarityColor }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={[styles.rarity, { color: rarityColor }]}>{item.rarity.toUpperCase()}</Text>
        </View>
        {item.is_equipped && (
          <View style={styles.equippedBadge}>
            <Text style={styles.equippedText}>EQUIPPED</Text>
          </View>
        )}
      </View>

      {item.description && (
        <Text style={styles.description}>{item.description}</Text>
      )}

      <View style={styles.actions}>
        {onEquip && (
          <TouchableOpacity
            style={[styles.actionBtn, item.is_equipped ? styles.unequipBtn : styles.equipBtn]}
            onPress={() => onEquip(item)}
          >
            <Text style={styles.actionText}>{item.is_equipped ? 'Unequip' : 'Equip'}</Text>
          </TouchableOpacity>
        )}
        {onDrop && (
          <TouchableOpacity style={[styles.actionBtn, styles.dropBtn]} onPress={() => onDrop(item)}>
            <Text style={styles.actionText}>Drop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  name: { ...theme.typography.bodyBold, color: theme.colors.text },
  rarity: { ...theme.typography.caption },
  equippedBadge: {
    backgroundColor: theme.colors.accent,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  equippedText: { ...theme.typography.caption, color: theme.colors.background },
  description: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  actionBtn: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  equipBtn: { backgroundColor: theme.colors.accent },
  unequipBtn: { backgroundColor: theme.colors.border },
  dropBtn: { backgroundColor: theme.colors.error },
  actionText: { ...theme.typography.caption, color: theme.colors.text },
});

export default InventoryCard;
