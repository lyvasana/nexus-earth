import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { FactionBadge, FACTION_DATA } from '../components/FactionBadge';
import { useProfile } from '../services/useProfile';

const OPERATOR_ID = 'demo-operator-id';

export default function FactionScreen() {
  const { profile, updateProfile } = useProfile(OPERATOR_ID);

  const handleJoinFaction = (factionId: string) => {
    if (profile?.faction_id === factionId) {
      Alert.alert('Already Enlisted', 'You are already a member of this faction.');
      return;
    }
    Alert.alert(
      'Join Faction',
      `Swear allegiance to ${FACTION_DATA[factionId]?.name}?\n\nThis choice will affect your standing with all other factions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enlist',
          onPress: () => updateProfile({ faction_id: factionId }),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>// FACTION INTELLIGENCE</Text>
      <Text style={styles.pageSubtitle}>
        Four powers vie for dominance in the shattered world. Your allegiance shapes your destiny.
      </Text>

      {Object.entries(FACTION_DATA).map(([factionId, faction]) => {
        const isEnlisted = profile?.faction_id === factionId;

        return (
          <View
            key={factionId}
            style={[
              styles.factionCard,
              { borderColor: faction.color },
              isEnlisted && styles.enlisted,
            ]}
          >
            <View style={styles.cardHeader}>
              <FactionBadge factionId={factionId} size="lg" showName />
              {isEnlisted && (
                <View style={[styles.enlistedBadge, { backgroundColor: faction.color }]}>
                  <Text style={styles.enlistedText}>ENLISTED</Text>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>PHILOSOPHY</Text>
                <Text style={styles.statValue}>{factionId === 'iron_covenant' ? 'Order' : factionId === 'resonance_collective' ? 'Harmony' : factionId === 'void_syndicate' ? 'Profit' : 'Freedom'}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>TERRITORY</Text>
                <Text style={styles.statValue}>{Math.floor(Math.random() * 50 + 10)} nodes</Text>
              </View>
            </View>

            {!isEnlisted && (
              <TouchableOpacity
                style={[styles.joinBtn, { borderColor: faction.color }]}
                onPress={() => handleJoinFaction(factionId)}
              >
                <Text style={[styles.joinBtnText, { color: faction.color }]}>
                  ENLIST IN {faction.name.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md },
  pageTitle: {
    ...theme.typography.heading,
    color: theme.colors.accent,
    marginBottom: theme.spacing.xs,
  },
  pageSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginBottom: theme.spacing.lg,
  },
  factionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  enlisted: {
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  enlistedBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  enlistedText: {
    ...theme.typography.caption,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
  },
  statItem: { alignItems: 'center' },
  statLabel: { ...theme.typography.caption, color: theme.colors.textMuted },
  statValue: { ...theme.typography.bodyBold, color: theme.colors.text },
  joinBtn: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    alignItems: 'center',
  },
  joinBtnText: { ...theme.typography.caption, fontWeight: 'bold' },
});
