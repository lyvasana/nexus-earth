import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native';
import { theme } from '../theme/theme';
import { CombatLog, CombatEntry } from '../components/CombatLog';

// Static mock messages — will be replaced with Supabase Realtime in next iteration
const MOCK_CHANNEL_MESSAGES: CombatEntry[] = [
  { id: '1', timestamp: new Date(), type: 'system', message: 'Encrypted channel ECHO-7 established.' },
  { id: '2', timestamp: new Date(), type: 'info', message: '[GhostByte] Anyone securing the downtown nodes?' },
  { id: '3', timestamp: new Date(), type: 'warning', message: '[VoidHawk] Void Syndicate pushing west side. Watch out.' },
  { id: '4', timestamp: new Date(), type: 'capture', message: '[IronClad] Iron Covenant secured DELTA-3 node.', value: 1 },
  { id: '5', timestamp: new Date(), type: 'info', message: '[SilentFreq] Resonance spike detected at grid F9.' },
];

const CHANNELS = ['GLOBAL', 'FACTION', 'LOCAL', 'SQUAD'];

export default function CommsScreen() {
  const [activeChannel, setActiveChannel] = useState('GLOBAL');
  const [messages, setMessages] = useState<CombatEntry[]>(MOCK_CHANNEL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: CombatEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: 'info',
      message: `[YOU] ${inputText.trim()}`,
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Channel Tabs */}
      <View style={styles.channelRow}>
        {CHANNELS.map(ch => (
          <TouchableOpacity
            key={ch}
            style={[styles.channelTab, activeChannel === ch && styles.activeChannelTab]}
            onPress={() => setActiveChannel(ch)}
          >
            <Text style={[styles.channelText, activeChannel === ch && styles.activeChannelText]}>
              #{ch}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Messages */}
      <View style={styles.messageContainer}>
        <CombatLog entries={messages.filter(m => activeChannel === 'GLOBAL' || m.type !== 'system')} maxEntries={100} />
      </View>

      {/* Notice */}
      <View style={styles.notice}>
        <Text style={styles.noticeText}>⚡ Real-time faction comms via Supabase Realtime — coming in Iteration 3</Text>
      </View>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Transmit message..."
          placeholderTextColor={theme.colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  channelRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  channelTab: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  activeChannelTab: { backgroundColor: theme.colors.accent },
  channelText: { ...theme.typography.caption, color: theme.colors.textMuted },
  activeChannelText: { color: theme.colors.background },
  messageContainer: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  notice: {
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  noticeText: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputRow: {
    flexDirection: 'row',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    color: theme.colors.text,
    ...theme.typography.body,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.accent,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { fontSize: 18, color: theme.colors.background },
});
