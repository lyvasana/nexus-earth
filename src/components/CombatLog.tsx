import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme/theme';

export interface CombatEntry {
  id: string;
  timestamp: Date;
  type: 'damage' | 'heal' | 'capture' | 'info' | 'warning' | 'system';
  message: string;
  value?: number;
}

interface CombatLogProps {
  entries: CombatEntry[];
  maxEntries?: number;
}

const ENTRY_COLORS: Record<string, string> = {
  damage: theme.colors.error,
  heal: '#2ecc71',
  capture: theme.colors.accent,
  info: theme.colors.text,
  warning: '#f39c12',
  system: theme.colors.textMuted,
};

const ENTRY_PREFIXES: Record<string, string> = {
  damage: '[DMG]',
  heal: '[HEAL]',
  capture: '[CAP]',
  info: '[INFO]',
  warning: '[WARN]',
  system: '[SYS]',
};

export const CombatLog: React.FC<CombatLogProps> = ({ entries, maxEntries = 50 }) => {
  const scrollRef = useRef<ScrollView>(null);
  const displayEntries = entries.slice(-maxEntries);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [entries]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>// TACTICAL FEED</Text>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {displayEntries.map((entry) => (
          <View key={entry.id} style={styles.entry}>
            <Text style={[styles.prefix, { color: ENTRY_COLORS[entry.type] }]}>
              {ENTRY_PREFIXES[entry.type]}
            </Text>
            <Text style={styles.message}>
              {entry.message}
              {entry.value !== undefined && (
                <Text style={{ color: ENTRY_COLORS[entry.type] }}> ({entry.value > 0 ? '+' : ''}{entry.value})</Text>
              )}
            </Text>
          </View>
        ))}
        {displayEntries.length === 0 && (
          <Text style={styles.empty}>No tactical events recorded.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    maxHeight: 200,
  },
  header: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  scroll: {
    padding: theme.spacing.xs,
  },
  entry: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
  },
  prefix: {
    ...theme.typography.mono,
    fontSize: 9,
    minWidth: 44,
  },
  message: {
    ...theme.typography.mono,
    fontSize: 10,
    color: theme.colors.text,
    flex: 1,
  },
  empty: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    padding: theme.spacing.xs,
  },
});

export default CombatLog;
