import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { NexusNode } from '../types';

interface UseNodesOptions {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}

export const useNodes = (options: UseNodesOptions = {}) => {
  const { latitude, longitude, radiusKm = 50 } = options;
  const [nodes, setNodes] = useState<NexusNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNodes = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('nexus_nodes')
        .select('*')
        .eq('is_active', true);

      // Filter by proximity if coordinates are provided
      if (latitude !== undefined && longitude !== undefined) {
        // Use PostGIS bounding box approximation
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos(latitude * Math.PI / 180));
        query = query
          .gte('latitude', latitude - latDelta)
          .lte('latitude', latitude + latDelta)
          .gte('longitude', longitude - lngDelta)
          .lte('longitude', longitude + lngDelta);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      setNodes(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, radiusKm]);

  const captureNode = async (nodeId: string, operatorId: string, factionId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('nexus_nodes')
        .update({
          controlling_faction: factionId,
          last_captured_by: operatorId,
          last_captured_at: new Date().toISOString(),
        })
        .eq('id', nodeId);

      if (updateError) throw updateError;
      await fetchNodes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getNearestNode = (): NexusNode | null => {
    if (!latitude || !longitude || nodes.length === 0) return null;
    return nodes.reduce((nearest, node) => {
      const distA = Math.hypot(nearest.latitude - latitude, nearest.longitude - longitude);
      const distB = Math.hypot(node.latitude - latitude, node.longitude - longitude);
      return distB < distA ? node : nearest;
    });
  };

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  // Real-time subscription for node updates
  useEffect(() => {
    const channel = supabase
      .channel('nexus_nodes_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'nexus_nodes',
      }, () => {
        fetchNodes();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchNodes]);

  return { nodes, loading, error, captureNode, getNearestNode, refetch: fetchNodes };
};

export default useNodes;
