import { create } from 'zustand';

import { supabase } from '@/lib/supabase';
import type { Profile, Mix } from '@/types/database';

interface ProfileStore {
  profile: Profile | null;
  mixes: Mix[];
  isLoading: boolean;
  error: string | null;
  fetchProfile: (userId: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  profile: null,
  mixes: [],
  isLoading: false,
  error: null,
};

export const useProfileStore = create<ProfileStore>((set) => ({
  ...initialState,

  fetchProfile: async (userId: string) => {
    set({ isLoading: true, error: null });

    const [profileResult, mixesResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase
        .from('mixes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    if (profileResult.error) {
      set({
        isLoading: false,
        error: profileResult.error.message,
        mixes: [],
      });
      return;
    }

    set({
      profile: profileResult.data as Profile,
      mixes: mixesResult.error ? [] : (mixesResult.data as Mix[]),
      isLoading: false,
      error: null,
    });
  },

  reset: () => set(initialState),
}));
