import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Animated, Dimensions,
} from 'react-native';
import { theme } from '../theme/theme';
import { FactionBadge, FACTION_DATA } from '../components/FactionBadge';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'NEXUS EARTH',
    subtitle: 'The world shattered. The Currents remain.',
    body: 'Dimensional Tears scarred reality. Ancient energies pulse through Nexus Current lines\u2014the last resource worth fighting for. Choose your allegiance. Claim the world.',
    icon: '\u29d8',
  },
  {
    id: 'mechanics',
    title: 'HOW IT WORKS',
    subtitle: 'The real world is your battlefield.',
    body: 'Nexus Nodes are anchored to real GPS coordinates. Move physically to capture nodes, accumulate Resonance, and expand your faction\u2019s territory. Anomalies shift. Alliances break.',
    icon: '\ud83d\uddfa\ufe0f',
  },
  {
    id: 'callsign',
    title: 'IDENTIFY YOURSELF',
    subtitle: 'Every operator needs a callsign.',
    body: null,
    icon: '\ud83d\udce1',
  },
  {
    id: 'faction',
    title: 'CHOOSE YOUR FACTION',
    subtitle: 'Your allegiance defines your war.',
    body: null,
    icon: '\u2694\ufe0f',
  },
];

interface OnboardingScreenProps {
  onComplete: (callsign: string, factionId: string) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [callsign, setCallsign] = useState('');
  const [selectedFaction, setSelectedFaction] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const nextStep = () => {
    if (step < ONBOARDING_STEPS.length - 1) {
      Animated.timing(slideAnim, {
        toValue: -(step + 1) * width,
        duration: 300,
        useNativeDriver: true,
      }).start();
      setStep(prev => prev + 1);
    } else {
      onComplete(callsign, selectedFaction);
    }
  };

  const canAdvance = () => {
    if (step === 2) return callsign.length >= 3;
    if (step === 3) return !!selectedFaction;
    return true;
  };

  const currentStep = ONBOARDING_STEPS[step];

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.progressRow}>
        {ONBOARDING_STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === step ? styles.activeDot : i < step ? styles.completedDot : null,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.icon}>{currentStep.icon}</Text>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.subtitle}>{currentStep.subtitle}</Text>

        {currentStep.body && (
          <Text style={styles.body}>{currentStep.body}</Text>
        )}

        {/* Callsign Input */}
        {step === 2 && (
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter callsign (3-16 chars)"
              placeholderTextColor={theme.colors.textMuted}
              value={callsign}
              onChangeText={text => setCallsign(text.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16))}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={16}
            />
            {callsign.length > 0 && callsign.length < 3 && (
              <Text style={styles.hint}>Callsign must be at least 3 characters.</Text>
            )}
          </View>
        )}

        {/* Faction Selection */}
        {step === 3 && (
          <View style={styles.factionList}>
            {Object.entries(FACTION_DATA).map(([id, faction]) => (
              <TouchableOpacity
                key={id}
                style={[
                  styles.factionOption,
                  { borderColor: faction.color },
                  selectedFaction === id && { backgroundColor: faction.color + '22' },
                ]}
                onPress={() => setSelectedFaction(id)}
              >
                <FactionBadge factionId={id} size="md" showName />
                {selectedFaction === id && (
                  <Text style={[styles.selectedMark, { color: faction.color }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.nextBtn, !canAdvance() && styles.disabledBtn]}
        onPress={nextStep}
        disabled={!canAdvance()}
      >
        <Text style={styles.nextBtnText}>
          {step === ONBOARDING_STEPS.length - 1 ? 'ENTER THE NEXUS' : 'CONTINUE'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  activeDot: { backgroundColor: theme.colors.accent, width: 24 },
  completedDot: { backgroundColor: theme.colors.accent + '88' },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  icon: { fontSize: 72, marginBottom: theme.spacing.lg },
  title: {
    ...theme.typography.title,
    color: theme.colors.accent,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  body: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputSection: { width: '100%', marginTop: theme.spacing.lg },
  textInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    ...theme.typography.heading,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    textAlign: 'center',
    letterSpacing: 2,
  },
  hint: {
    ...theme.typography.caption,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 4,
  },
  factionList: { width: '100%', gap: theme.spacing.sm, marginTop: theme.spacing.md },
  factionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  selectedMark: { fontSize: 20, fontWeight: 'bold' },
  nextBtn: {
    margin: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  disabledBtn: { opacity: 0.4 },
  nextBtnText: {
    ...theme.typography.bodyBold,
    color: theme.colors.background,
    letterSpacing: 2,
  },
});
