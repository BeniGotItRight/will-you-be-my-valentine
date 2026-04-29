import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export interface AppState {
  id: number;
  stage_index: number;
  temperature: number;
  garden_flowers: {x: number, y: number, id: number}[];
  bensons_choice: Record<string, string>;
  slot_result: string;
  scratch_revealed: boolean;
  mood: string | null;
  together_category: string | null;
  together_q_index: number;
  together_benson_ans: string | null;
  together_kendy_ans: string | null;
}

export const useAppState = () => {
  const [appState, setAppState] = useState<AppState | null>(null);

  useEffect(() => {
    const fetchState = async () => {
      const { data } = await supabase.from('app_state').select('*').eq('id', 1).single();
      if (data) setAppState(data as AppState);
    };
    fetchState();

    const channel = supabase
      .channel('app_state_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'app_state', filter: 'id=eq.1' },
        (payload) => setAppState(payload.new as AppState)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateAppState = async (updates: Partial<AppState>) => {
    // Optimistic UI update
    if (appState) setAppState({ ...appState, ...updates });
    await supabase.from('app_state').update(updates).eq('id', 1);
  };

  return { appState, updateAppState };
};
