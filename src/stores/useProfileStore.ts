import { create } from 'zustand';

import { supabase } from '@/lib/supabase';
import type { ProfileStore, SavedMix, ProfileData } from '@/types/profile';

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

    const raw = profileResult.data as Record<string, unknown>;
    const profile: ProfileData = {
      id: raw['id'] as string,
      name: (raw['name'] as string | null) ?? null,
      email: raw['email'] as string,
      createdAt: (raw['created_at'] as string) ?? new Date().toISOString(),
    };

    const mixes: SavedMix[] = mixesResult.error
      ? []
      : (mixesResult.data as Record<string, unknown>[]).map((row) => ({
          id: row['id'] as string,
          name: (row['name'] as string) ?? 'Mix sem nome',
          createdAt: row['created_at'] as string,
          ingredientIds: (row['ingredient_ids'] as string[]) ?? [],
          calories: (row['calories'] as number) ?? 0,
          proteins: (row['proteins'] as number) ?? 0,
        }));

    set({ profile, mixes, isLoading: false, error: null });
  },

  reset: () => set(initialState),
}));
