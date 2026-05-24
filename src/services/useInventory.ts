import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { InventoryItem } from '../types';

export const useInventory = (operatorId: string) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('inventory')
        .select('*')
        .eq('operator_id', operatorId)
        .order('acquired_at', { ascending: false });

      if (fetchError) throw fetchError;
      setInventory(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const equipItem = async (itemId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ is_equipped: true })
        .eq('id', itemId)
        .eq('operator_id', operatorId);

      if (updateError) throw updateError;
      await fetchInventory();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const unequipItem = async (itemId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('inventory')
        .update({ is_equipped: false })
        .eq('id', itemId)
        .eq('operator_id', operatorId);

      if (updateError) throw updateError;
      await fetchInventory();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const dropItem = async (itemId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('inventory')
        .delete()
        .eq('id', itemId)
        .eq('operator_id', operatorId);

      if (deleteError) throw deleteError;
      setInventory(prev => prev.filter(item => item.id !== itemId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (operatorId) fetchInventory();
  }, [operatorId]);

  return { inventory, loading, error, equipItem, unequipItem, dropItem, refetch: fetchInventory };
};

export default useInventory;
