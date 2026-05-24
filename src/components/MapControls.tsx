import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface MapControlsProps {
  onCenterOnUser: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleLayer?: () => void;
  showNexusCurrents?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onCenterOnUser,
  onZoomIn,
  onZoomOut,
  onToggleLayer,
  showNexusCurrents = true,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onZoomIn}>
        <Text style={styles.icon}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={onZoomOut}>
        <Text style={styles.icon}>−</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.button} onPress={onCenterOnUser}>
        <Text style={styles.icon}>📍</Text>
      </TouchableOpacity>

      {onToggleLayer && (
        <TouchableOpacity
          style={[styles.button, showNexusCurrents && styles.activeButton]}
          onPress={onToggleLayer}
        >
          <Text style={styles.icon}>⚡</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '40%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: theme.colors.accent + '33',
  },
  icon: {
    fontSize: 20,
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
});

export default MapControls;
