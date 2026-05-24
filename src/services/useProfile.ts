import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Operator } from '../types';

export const useProfile = (operatorId: string) => {
  const [profile, setProfile] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('operators')
        .select('*')
        .eq('id', operatorId)
        .single();

      if (fetchError) throw fetchError;
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Operator>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('operators')
        .update(updates)
        .eq('id', operatorId)
        .select()
        .single();

      if (updateError) throw updateError;
      setProfile(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const updateResonance = async (amount: number) => {
    if (!profile) return;
    const newResonance = Math.max(0, Math.min(profile.max_resonance, profile.resonance + amount));
    return updateProfile({ resonance: newResonance });
  };

  const addExperience = async (xp: number) => {
    if (!profile) return;
    const newXp = profile.experience + xp;
    const xpThreshold = profile.level * 1000;
    if (newXp >= xpThreshold) {
      return updateProfile({ experience: newXp - xpThreshold, level: profile.level + 1 });
    }
    return updateProfile({ experience: newXp });
  };

  useEffect(() => {
    if (operatorId) fetchProfile();
  }, [operatorId]);

  // Real-time subscription
  useEffect(() => {
    if (!operatorId) return;
    const channel = supabase
      .channel(`operator:${operatorId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'operators',
        filter: `id=eq.${operatorId}`,
      }, (payload) => {
        setProfile(payload.new as Operator);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [operatorId]);

  return { profile, loading, error, updateProfile, updateResonance, addExperience, refetch: fetchProfile };
};

export default useProfile;
