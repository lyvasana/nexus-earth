import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Operator } from '../types';
import { theme } from '../theme/theme';

interface OperatorHUDProps {
  operator: Operator;
}

export const OperatorHUD: React.FC<OperatorHUDProps> = ({ operator }) => {
  const resonancePct = (operator.resonance / operator.max_resonance) * 100;
  const xpPct = (operator.experience / (operator.level * 1000)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.callsign}>{operator.callsign}</Text>
        <Text style={styles.level}>LVL {operator.level}</Text>
      </View>

      <View style={styles.barRow}>
        <Text style={styles.barLabel}>RES</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, styles.resonanceBar, { width: `${resonancePct}%` }]} />
        </View>
        <Text style={styles.barValue}>{operator.resonance}/{operator.max_resonance}</Text>
      </View>

      <View style={styles.barRow}>
        <Text style={styles.barLabel}>XP</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, styles.xpBar, { width: `${xpPct}%` }]} />
        </View>
        <Text style={styles.barValue}>{operator.experience}/{operator.level * 1000}</Text>
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.stat}>💰 {operator.credits}</Text>
        <Text style={styles.stat}>🎯 {operator.faction_id?.replace('_', ' ').toUpperCase() || 'NO FACTION'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  callsign: {
    ...theme.typography.bodyBold,
    color: theme.colors.accent,
  },
  level: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: theme.spacing.xs,
  },
  barLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    width: 30,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  resonanceBar: {
    backgroundColor: theme.colors.resonance,
  },
  xpBar: {
    backgroundColor: theme.colors.accent,
  },
  barValue: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    width: 60,
    textAlign: 'right',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  stat: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
});

export default OperatorHUD;
