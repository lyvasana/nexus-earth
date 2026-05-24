import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { theme } from '../theme/theme';
import { useNodes } from '../services/useNodes';
import { useProfile } from '../services/useProfile';
import { NodeMarker } from '../components/NodeMarker';
import { OperatorHUD } from '../components/OperatorHUD';
import { MapControls } from '../components/MapControls';
import { NodeDetailModal } from '../components/NodeDetailModal';
import { LoadingScreen } from '../components/LoadingScreen';
import { NexusNode } from '../types';

// OPERATOR_ID would come from auth context in production
const OPERATOR_ID = 'demo-operator-id';

export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedNode, setSelectedNode] = useState<NexusNode | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const { profile, loading: profileLoading } = useProfile(OPERATOR_ID);
  const { nodes, captureNode } = useNodes({
    latitude: location?.latitude,
    longitude: location?.longitude,
    radiusKm: 100,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(coords);
      setRegion(prev => ({ ...prev, ...coords }));
    })();
  }, []);

  const handleNodePress = (node: NexusNode) => {
    setSelectedNode(node);
    setModalVisible(true);
  };

  const handleCapture = async (node: NexusNode) => {
    if (!profile?.faction_id) return;
    await captureNode(node.id, OPERATOR_ID, profile.faction_id);
  };

  const handleCenterOnUser = () => {
    if (location) {
      setRegion(prev => ({ ...prev, ...location }));
    }
  };

  if (profileLoading) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}
        customMapStyle={darkMapStyle}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {nodes.map(node => (
          <Marker
            key={node.id}
            coordinate={{ latitude: node.latitude, longitude: node.longitude }}
            onPress={() => handleNodePress(node)}
          >
            <NodeMarker
              node={node}
              onPress={handleNodePress}
              isNearby={
                location
                  ? Math.hypot(node.latitude - location.latitude, node.longitude - location.longitude) < 0.01
                  : false
              }
            />
          </Marker>
        ))}
      </MapView>

      {profile && (
        <View style={styles.hudContainer}>
          <OperatorHUD operator={profile} />
        </View>
      )}

      <MapControls
        onCenterOnUser={handleCenterOnUser}
        onZoomIn={() => setRegion(r => ({ ...r, latitudeDelta: r.latitudeDelta * 0.7, longitudeDelta: r.longitudeDelta * 0.7 }))}
        onZoomOut={() => setRegion(r => ({ ...r, latitudeDelta: r.latitudeDelta * 1.3, longitudeDelta: r.longitudeDelta * 1.3 }))}
      />

      <NodeDetailModal
        node={selectedNode}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCapture={handleCapture}
        canCapture={!!location}
        currentFactionId={profile?.faction_id}
      />
    </View>
  );
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  map: { flex: 1 },
  hudContainer: {
    position: 'absolute',
    top: 50,
    left: theme.spacing.md,
    right: 70,
  },
});
