import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { NexusNode } from '../types';
import { theme } from '../theme/theme';
import { FactionBadge } from './FactionBadge';

interface NodeDetailModalProps {
  node: NexusNode | null;
  visible: boolean;
  onClose: () => void;
  onCapture?: (node: NexusNode) => void;
  canCapture?: boolean;
  currentFactionId?: string;
}

const NODE_TYPE_LABELS: Record<string, string> = {
  nexus_current: 'Nexus Current Convergence',
  anomaly_zone: 'Anomaly Zone',
  settlement: 'Settlement',
  ruin: 'Pre-Collapse Ruins',
  cache: 'Supply Cache',
};

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  visible,
  onClose,
  onCapture,
  canCapture = false,
  currentFactionId,
}) => {
  if (!node) return null;

  const isOwnFaction = node.controlling_faction === currentFactionId;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.nodeType}>{NODE_TYPE_LABELS[node.node_type] || node.node_type}</Text>
              <Text style={styles.nodeName}>{node.name}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {node.description && (
              <Text style={styles.description}>{node.description}</Text>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>COORDINATES</Text>
              <Text style={styles.detail}>
                {node.latitude.toFixed(4)}° N, {node.longitude.toFixed(4)}° W
              </Text>
            </View>

            {node.controlling_faction && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>CONTROLLED BY</Text>
                <FactionBadge factionId={node.controlling_faction} showName size="sm" />
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>RESONANCE OUTPUT</Text>
              <Text style={styles.detail}>{node.resonance_output} per hour</Text>
            </View>

            {node.anomaly_level > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>ANOMALY LEVEL</Text>
                <Text style={[styles.detail, { color: theme.colors.warning }]}>
                  {'!⚠️!'.repeat(Math.min(node.anomaly_level, 5))}
                </Text>
              </View>
            )}
          </ScrollView>

          {canCapture && !isOwnFaction && onCapture && (
            <TouchableOpacity
              style={styles.captureBtn}
              onPress={() => { onCapture(node); onClose(); }}
            >
              <Text style={styles.captureBtnText}>⚡ CAPTURE NODE</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '70%',
    borderTopWidth: 1,
    borderColor: theme.colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  nodeType: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    textTransform: 'uppercase',
  },
  nodeName: {
    ...theme.typography.heading,
    color: theme.colors.text,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: theme.colors.textMuted,
  },
  content: {
    padding: theme.spacing.md,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    marginBottom: 4,
  },
  detail: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  captureBtn: {
    backgroundColor: theme.colors.accent,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  captureBtnText: {
    ...theme.typography.bodyBold,
    color: theme.colors.background,
  },
});

export default NodeDetailModal;
