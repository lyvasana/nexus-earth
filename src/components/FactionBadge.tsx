import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface FactionBadgeProps {
  factionId: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const FACTION_DATA: Record<string, { name: string; color: string; icon: string; motto: string }> = {
  iron_covenant: {
    name: 'Iron Covenant',
    color: theme.colors.factionIron,
    icon: '⚙️',
    motto: 'Strength Through Unity',
  },
  resonance_collective: {
    name: 'Resonance Collective',
    color: theme.colors.factionResonance,
    icon: '⚡',
    motto: 'The Current Flows Through All',
  },
  void_syndicate: {
    name: 'Void Syndicate',
    color: theme.colors.factionVoid,
    icon: '🌀',
    motto: 'Profit From the Chaos',
  },
  free_operators: {
    name: 'Free Operators',
    color: theme.colors.factionFree,
    icon: '🔫',
    motto: 'No Masters, No Chains',
  },
};

const SIZE_MAP = {
  sm: { container: 24, font: 10, iconSize: 12 },
  md: { container: 36, font: 12, iconSize: 16 },
  lg: { container: 52, font: 14, iconSize: 24 },
};

export const FactionBadge: React.FC<FactionBadgeProps> = ({
  factionId,
  size = 'md',
  showName = false,
}) => {
  const faction = FACTION_DATA[factionId];
  if (!faction) return null;

  const { container, font, iconSize } = SIZE_MAP[size];

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.badge,
          { width: container, height: container, borderRadius: container / 2, borderColor: faction.color },
        ]}
      >
        <Text style={{ fontSize: iconSize }}>{faction.icon}</Text>
      </View>
      {showName && (
        <View>
          <Text style={[styles.name, { fontSize: font, color: faction.color }]}>{faction.name}</Text>
          <Text style={styles.motto}>{faction.motto}</Text>
        </View>
      )}
    </View>
  );
};

export { FACTION_DATA };

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  badge: {
    borderWidth: 2,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
  },
  motto: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
  },
});

export default FactionBadge;
