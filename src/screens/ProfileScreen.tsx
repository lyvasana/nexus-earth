import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../theme/theme';
import { useProfile } from '../services/useProfile';
import { FactionBadge } from '../components/FactionBadge';
import { LoadingScreen } from '../components/LoadingScreen';

const OPERATOR_ID = 'demo-operator-id';

export default function ProfileScreen() {
  const { profile, loading, updateProfile } = useProfile(OPERATOR_ID);
  const [editing, setEditing] = useState(false);

  if (loading) return <LoadingScreen message="Loading operator dossier..." />;
  if (!profile) return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Operator profile not found.</Text>
    </View>
  );

  const combatRating = Math.floor(
    (profile.level * 100) + (profile.experience / 10)
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarIcon}>🧑‍💻</Text>
          <View style={[styles.statusDot, styles.online]} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.callsign}>{profile.callsign}</Text>
          <Text style={styles.archetype}>{profile.archetype?.toUpperCase() || 'UNKNOWN ARCHETYPE'}</Text>
          <Text style={styles.level}>LEVEL {profile.level} OPERATOR</Text>
        </View>
      </View>

      {/* Faction */}
      {profile.faction_id && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FACTION ALLEGIANCE</Text>
          <FactionBadge factionId={profile.faction_id} showName size="lg" />
        </View>
      )}

      {/* Stats Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>OPERATOR STATS</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{profile.resonance}</Text>
            <Text style={styles.statLabel}>RESONANCE</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{profile.cyber_cells}</Text>
            <Text style={styles.statLabel}>CYBER-CELLS</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{profile.credits}</Text>
            <Text style={styles.statLabel}>CREDITS</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={[styles.statValue, { color: theme.colors.accent }]}>{combatRating}</Text>
            <Text style={styles.statLabel}>COMBAT RATING</Text>
          </View>
        </View>
      </View>

      {/* Lore Bio */}
      {profile.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FIELD DOSSIER</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => Alert.alert('Edit Profile', 'Profile editing coming in next iteration.')}
        >
          <Text style={styles.actionText}>✏️ Edit Callsign</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.dangerBtn]}
          onPress={() => Alert.alert('Abandon Faction', 'Are you sure? This has consequences.')}
        >
          <Text style={styles.actionText}>🛑 Leave Faction</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarContainer: { position: 'relative' },
  avatarIcon: { fontSize: 56 },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  online: { backgroundColor: '#2ecc71' },
  headerInfo: { flex: 1 },
  callsign: { ...theme.typography.heading, color: theme.colors.text },
  archetype: { ...theme.typography.caption, color: theme.colors.accent },
  level: { ...theme.typography.caption, color: theme.colors.textMuted },
  section: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  statCell: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
  },
  statValue: {
    ...theme.typography.heading,
    color: theme.colors.text,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  bio: { ...theme.typography.body, color: theme.colors.textMuted, fontStyle: 'italic' },
  actions: { gap: theme.spacing.sm, marginBottom: theme.spacing.xl },
  actionBtn: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  dangerBtn: { borderColor: theme.colors.error },
  actionText: { ...theme.typography.bodyBold, color: theme.colors.text },
  errorText: { ...theme.typography.body, color: theme.colors.error, textAlign: 'center', marginTop: 100 },
});
