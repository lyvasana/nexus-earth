import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { NexusNode } from '../types';
import { theme } from '../theme/theme';

interface NodeMarkerProps {
  node: NexusNode;
  onPress: (node: NexusNode) => void;
  isNearby?: boolean;
}

const NODE_TYPE_ICONS: Record<string, string> = {
  nexus_current: '⚡',
  anomaly_zone: '🌀',
  settlement: '🏚️',
  ruin: '🏛️',
  cache: '📦',
};

const FACTION_COLORS: Record<string, string> = {
  iron_covenant: theme.colors.factionIron,
  resonance_collective: theme.colors.factionResonance,
  void_syndicate: theme.colors.factionVoid,
  free_operators: theme.colors.factionFree,
  neutral: theme.colors.textMuted,
};

export const NodeMarker: React.FC<NodeMarkerProps> = ({ node, onPress, isNearby = false }) => {
  const factionColor = FACTION_COLORS[node.controlling_faction || 'neutral'] || theme.colors.textMuted;
  const icon = NODE_TYPE_ICONS[node.node_type] || '📍';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: factionColor },
        isNearby && styles.nearby,
      ]}
      onPress={() => onPress(node)}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={[styles.dot, { backgroundColor: factionColor }]} />
      {isNearby && (
        <View style={styles.nearbyPulse} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 16,
  },
  dot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nearby: {
    transform: [{ scale: 1.2 }],
  },
  nearbyPulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    opacity: 0.4,
  },
});

export default NodeMarker;
