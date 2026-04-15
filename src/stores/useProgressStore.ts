import { create } from 'zustand';

import { supabase } from '@/lib/supabase';
import type { DailyCheckin } from '@/types/database';

function getTodayDate(): string {
  return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
}

interface AddCheckinData {
  energyScore: number;
  sleepScore: number;
  focusScore: number;
}

interface ProgressStore {
  checkins: DailyCheckin[];
  isLoading: boolean;
  error: string | null;
  fetchCheckins: (userId: string) => Promise<void>;
  addCheckin: (userId: string, data: AddCheckinData) => Promise<void>;
  getTodayCheckin: () => DailyCheckin | undefined;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  checkins: [],
  isLoading: false,
  error: null,

  fetchCheckins: async (userId: string) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      set({ isLoading: false, error: error.message });
      return;
    }
    set({ checkins: (data as DailyCheckin[]) ?? [], isLoading: false });
  },

  addCheckin: async (userId: string, data: AddCheckinData) => {
    const date = getTodayDate();

    // Optimistic duplicate guard
    const existing = get().checkins.find((c) => c.date === date);
    if (existing) return;

    const { data: inserted, error } = await supabase
      .from('daily_checkins')
      .insert({
        user_id: userId,
        date,
        energy_score: data.energyScore,
        sleep_score: data.sleepScore,
        focus_score: data.focusScore,
      })
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return;
    }

    set((state) => ({ checkins: [inserted as DailyCheckin, ...state.checkins] }));
  },

  getTodayCheckin() {
    const today = getTodayDate();
    return get().checkins.find((c) => c.date === today);
  },
}));
