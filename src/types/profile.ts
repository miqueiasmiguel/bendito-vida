export interface SavedMix {
  id: string;
  name: string;
  /** ISO date string from Supabase */
  createdAt: string;
  /** IDs referencing INGREDIENTS data */
  ingredientIds: string[];
  calories: number;
  proteins: number;
}

export interface ProfileData {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
}

export interface ProfileState {
  profile: ProfileData | null;
  mixes: SavedMix[];
  isLoading: boolean;
  error: string | null;
}

export interface ProfileActions {
  fetchProfile: (userId: string) => Promise<void>;
  reset: () => void;
}

export type ProfileStore = ProfileState & ProfileActions;
