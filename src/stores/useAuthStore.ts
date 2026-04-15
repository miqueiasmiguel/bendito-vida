import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

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
  markOnboardingComplete: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => {
  // Listen to auth state changes for session persistence between restarts.
  // Keep callback synchronous — fire profile fetch as a detached promise so
  // sessionChecked is set immediately and never blocks the splash screen.
  supabase.auth.onAuthStateChange((_event, session) => {
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

      // Fetch onboarding flag — detached so it never blocks session resolution
      supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', id)
        .single()
        .then(({ data }) => {
          set({
            onboardingCompleted: data?.onboarding_completed ?? false,
            onboardingChecked: true,
          });
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

    markOnboardingComplete: async () => {
      const { user } = get();
      if (!user) return;

      await supabase.from('profiles').upsert({ id: user.id, onboarding_completed: true });

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
        // the full URL here. On Android this block is skipped (result.type === 'dismiss')
        // because the OS delivers the deep link as a navigation intent to (auth)/callback.
        if (result.type === 'success') {
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
