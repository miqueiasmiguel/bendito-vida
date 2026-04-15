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
  sessionChecked: boolean;
}

interface AuthActions {
  setUser: (user: AuthUser | null) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => {
  // Listen to auth state changes for session persistence between restarts
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
      });
    } else {
      set({ user: null, sessionChecked: true });
    }
  });

  return {
    user: null,
    isLoading: false,
    error: null,
    sessionChecked: false,

    setUser: (user) => set({ user }),

    clearError: () => set({ error: null }),

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
      set({ user: null, isLoading: false });
    },
  };
});
