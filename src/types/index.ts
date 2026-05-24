export type RarityTier = 'common' | 'refined' | 'ornate' | 'legendary' | 'mythic';
export type NodeType = 'nexus' | 'salvage' | 'wilderness' | 'anomaly' | 'vault';
export type OperatorClass = 'Vanguard' | 'Enforcer' | 'Fixer' | 'Shifter';

export interface LootItem {
  id: string;
  name: string;
  rarity: RarityTier;
  type: string;
  origin: string;
  description: string;
  logId: string;
  coordinates: { lat: number; lng: number };
  epoch: number;
  discoverer: string;
  imageUrl?: string;
  resonance: number;
}

export interface NexusNode {
  id: string;
  name: string;
  type: NodeType;
  coordinates: { lat: number; lng: number };
  resonanceLevel: number;
  controlled_by?: string;
  anomaly_threat: number;
  last_harvested?: number;
}

export interface OperatorProfile {
  id: string;
  username: string;
  operatorClass: OperatorClass;
  level: number;
  resonance: number;
  cyberCells: number;
  syncPercent: number;
  faction?: string;
  origin_coords?: { lat: number; lng: number };
  created_at: string;
}

export interface CompanionEntity {
  id: string;
  name: string;
  type: string;
  level: number;
  bond: number;
  abilities: string[];
  description: string;
}

export interface VoxelBlock {
  id: string;
  position: [number, number, number];
  type: string;
  color: string;
}
