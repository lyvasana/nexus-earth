import { LootItem, NexusNode, OperatorProfile, CompanionEntity } from '../types';

export const mockProfile: OperatorProfile = {
  id: 'op_042',
  username: 'OPERATOR_042',
  operatorClass: 'Fixer',
  level: 12,
  resonance: 4840,
  cyberCells: 7,
  syncPercent: 88,
  faction: 'The Reclaimer Accord',
  origin_coords: { lat: 37.9610, lng: -122.2881 },
  created_at: '2024-01-15T08:00:00Z',
};

export const mockLoot: LootItem[] = [
  {
    id: 'item_001', name: 'Pre-Collapse Data Core', rarity: 'mythic', type: 'Relic',
    origin: 'The Central Vault Outpost',
    description: 'Intact localized storage containing historical agricultural blueprints. Acquired from heavily fortified faction safe house.',
    logId: 'LOG-0441', coordinates: { lat: 37.9542, lng: -122.2825 },
    epoch: 1716518940, discoverer: 'OPERATOR_042',
    imageUrl: 'https://images.unsplash.com/photo-1618237273934-8c7c9eb1e342?w=400&q=80',
    resonance: 980,
  },
  {
    id: 'item_002', name: 'Carbon-Weave Mesh', rarity: 'ornate', type: 'Gear',
    origin: 'The Alameda Wilds (High-Resonance)',
    description: 'Highly sought-after gear containing randomized Fixer attribute bonuses. Found near mutated dimensional flora.',
    logId: 'LOG-0439', coordinates: { lat: 37.9610, lng: -122.2881 },
    epoch: 1716432540, discoverer: 'OPERATOR_042', resonance: 420,
  },
  {
    id: 'item_003', name: 'Scrap Polymer', rarity: 'common', type: 'Material',
    origin: 'The Deanberter Salvage Depot',
    description: 'Mass-produced building material easily obtained via local radio missions. Mild weathering detected.',
    logId: 'LOG-0435', coordinates: { lat: 37.9488, lng: -122.2705 },
    epoch: 1716346140, discoverer: 'OPERATOR_042', resonance: 20,
  },
  {
    id: 'item_004', name: 'Resonance Crystal Shard', rarity: 'legendary', type: 'Resource',
    origin: 'Nexus Current Node #7 - Wildcat Canyon',
    description: 'Crystallized Resonance energy harvested from a high-output Nexus Current. Glows faintly in darkness.',
    logId: 'LOG-0447', coordinates: { lat: 37.9720, lng: -122.2650 },
    epoch: 1716605340, discoverer: 'OPERATOR_042', resonance: 750,
  },
  {
    id: 'item_005', name: 'Anomaly Tissue Sample', rarity: 'refined', type: 'Biological',
    origin: 'El Sobrante Dimensional Tear - Zone 3',
    description: 'Organic matter harvested from a subdued Anomaly. Used in Fixer augmentation recipes.',
    logId: 'LOG-0443', coordinates: { lat: 37.9580, lng: -122.2800 },
    epoch: 1716518000, discoverer: 'OPERATOR_042', resonance: 180,
  },
];

export const mockNodes: NexusNode[] = [
  { id: 'node_001', name: 'Kennedy Grove Nexus', type: 'nexus', coordinates: { lat: 37.9720, lng: -122.2650 }, resonanceLevel: 87, anomaly_threat: 45 },
  { id: 'node_002', name: 'Richmond Salvage Depot', type: 'salvage', coordinates: { lat: 37.9542, lng: -122.2825 }, resonanceLevel: 22, anomaly_threat: 10 },
  { id: 'node_003', name: 'Wildcat Canyon Wilderness', type: 'wilderness', coordinates: { lat: 37.9610, lng: -122.2881 }, resonanceLevel: 55, anomaly_threat: 30 },
  { id: 'node_004', name: 'El Sobrante Dimensional Tear', type: 'anomaly', coordinates: { lat: 37.9580, lng: -122.2800 }, resonanceLevel: 91, anomaly_threat: 88 },
  { id: 'node_005', name: 'Central Vault Outpost', type: 'vault', coordinates: { lat: 37.9488, lng: -122.2705 }, resonanceLevel: 70, anomaly_threat: 60 },
];

export const mockCompanion: CompanionEntity = {
  id: 'comp_001', name: 'Glitch', type: 'Anomaly-Bonded',
  level: 8, bond: 72,
  abilities: ['Phase Shift', 'Resonance Pulse', 'Dimensional Anchor'],
  description: 'A small extradimensional entity that bonded with OPERATOR_042 during a Tear encounter. Loyal and unpredictable.',
};
