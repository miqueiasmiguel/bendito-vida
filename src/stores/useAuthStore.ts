import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';
import { useQuizStore } from '@/stores/useQuizStore';
import type { NutritionProfile } from '@/utils/match-profile';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  /** Auth session resolved (user or null known) */
  sessionChecked: boolean;
  /** Profile row fetched — only meaningful when user != null */
  onboardingChecked: boolean;
  onboardingCompleted: boolean;
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  markOnboardingComplete: (profile: NutritionProfile) => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => {
  // Listen to auth state changes for session persistence between restarts.
  // Keep callback synchronous — fire profile fetch as a detached promise so
  // sessionChecked is set immediately and never blocks the splash screen.
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESH_FAILED') {
      supabase.auth.signOut();
      set({ user: null, sessionChecked: true, onboardingChecked: true });
      return;
    }
    if (session?.user) {
      const { id, email, created_at, user_metadata } = session.user;

      set({
        user: {
          id,
          name: (user_metadata?.full_name as string) ?? email ?? '',
          email: email ?? '',
          createdAt: created_at,
        },
        sessionChecked: true,
        onboardingChecked: false,
      });

      // Fetch onboarding flag, bioactive profile and display name — detached so it never blocks session resolution
      supabase
        .from('profiles')
        .select('onboarding_completed, bioactive_profile, name')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          set((state) => ({
            user: state.user
              ? { ...state.user, name: (data?.name as string | null) ?? state.user.name }
              : state.user,
            onboardingCompleted: data?.onboarding_completed ?? false,
            onboardingChecked: true,
          }));
          // Hydrate quiz store with persisted profile so bioactive map survives restarts.
          // One-way dependency: auth bootstraps quiz state at startup.
          if (data?.bioactive_profile) {
            useQuizStore.getState().setProfile(data.bioactive_profile as NutritionProfile);
          }
        })
        .catch(() => {
          // On network/RLS error treat as incomplete; quiz is idempotent
          set({ onboardingCompleted: false, onboardingChecked: true });
        });
    } else {
      set({
        user: null,
        onboardingCompleted: false,
        onboardingChecked: true,
        sessionChecked: true,
      });
    }
  });

  return {
    user: null,
    isLoading: false,
    error: null,
    sessionChecked: false,
    onboardingChecked: false,
    onboardingCompleted: false,

    setUser: (user) => set({ user }),

    clearError: () => set({ error: null }),

    markOnboardingComplete: async (profile: NutritionProfile) => {
      const { user } = get();
      if (!user) return;

      await supabase
        .from('profiles')
        .upsert({ id: user.id, onboarding_completed: true, bioactive_profile: profile });

      set({ onboardingCompleted: true });
    },

    signInWithGoogle: async () => {
      set({ isLoading: true, error: null });
      try {
        const redirectTo = makeRedirectUri({ native: 'bendito-vida://auth/callback' });

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo },
        });

        if (error) throw error;
        if (!data.url) throw new Error('URL de autenticação não recebida');

        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

        // iOS: SFSafariViewController captures the redirect in-app and returns
        // the full URL here. On Android the Custom Tab delivers the deep link as a
        // navigation intent to (auth)/callback AND may also return type='success' —
        // restrict the manual exchange to iOS only to avoid a double-exchange race.
        if (result.type === 'success' && Platform.OS === 'ios') {
          const queryIndex = result.url.indexOf('?');
          if (queryIndex !== -1) {
            const params = new URLSearchParams(result.url.substring(queryIndex + 1));
            const code = params.get('code');
            if (code) {
              const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
              if (sessionError) throw sessionError;
            }
          }
        }
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : 'Erro ao autenticar com Google',
        });
      } finally {
        set({ isLoading: false });
      }
    },

    signOut: async () => {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({ user: null, onboardingCompleted: false, onboardingChecked: true, isLoading: false });
    },
  };
});
