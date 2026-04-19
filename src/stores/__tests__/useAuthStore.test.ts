import { act, renderHook } from '@testing-library/react-native';

import type { NutrientTag } from '@/data/quiz-questions';
import { useAuthStore } from '../useAuthStore';

// Mock useQuizStore (imported by useAuthStore for profile hydration)
jest.mock('@/stores/useQuizStore', () => ({
  useQuizStore: {
    getState: jest.fn(() => ({ setProfile: jest.fn() })),
  },
}));

// Mock supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      signInWithOAuth: jest.fn(),
      exchangeCodeForSession: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

// Mock expo-auth-session
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'bendito-vida://auth/callback'),
}));

// Mock expo-web-browser
jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: jest.fn(),
}));

const { supabase } = require('@/lib/supabase') as {
  supabase: {
    auth: {
      onAuthStateChange: jest.Mock;
      signInWithOAuth: jest.Mock;
      exchangeCodeForSession: jest.Mock;
      signOut: jest.Mock;
    };
    from: jest.Mock;
  };
};
const WebBrowser = require('expo-web-browser') as { openAuthSessionAsync: jest.Mock };

// Reset store state between tests
beforeEach(() => {
  act(() => {
    useAuthStore.setState({
      user: null,
      isLoading: false,
      error: null,
      sessionChecked: false,
      onboardingChecked: false,
      onboardingCompleted: false,
    });
  });
  jest.clearAllMocks();
});

describe('useAuthStore', () => {
  describe('signInWithGoogle', () => {
    it('sets isLoading true while waiting for browser', async () => {
      supabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://google.com/auth' },
        error: null,
      });
      // Never resolves – so loading stays true
      WebBrowser.openAuthSessionAsync.mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.signInWithGoogle();
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('exchanges PKCE code and clears loading on success (iOS path)', async () => {
      supabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://google.com/auth' },
        error: null,
      });
      WebBrowser.openAuthSessionAsync.mockResolvedValue({
        type: 'success',
        url: 'bendito-vida://auth/callback?code=pkce-code-123',
      });
      supabase.auth.exchangeCodeForSession.mockResolvedValue({ data: {}, error: null });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('pkce-code-123');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('sets error on OAuth failure', async () => {
      supabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: null },
        error: new Error('OAuth error'),
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(result.current.error).toBe('OAuth error');
      expect(result.current.isLoading).toBe(false);
    });

    it('does not exchange code when user cancels browser', async () => {
      supabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://google.com/auth' },
        error: null,
      });
      WebBrowser.openAuthSessionAsync.mockResolvedValue({ type: 'cancel' });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signInWithGoogle();
      });

      expect(supabase.auth.exchangeCodeForSession).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('store does not expose email/password methods', () => {
    it('has no signIn method', () => {
      const { result } = renderHook(() => useAuthStore());
      expect((result.current as unknown as Record<string, unknown>).signIn).toBeUndefined();
    });

    it('has no signUp method', () => {
      const { result } = renderHook(() => useAuthStore());
      expect((result.current as unknown as Record<string, unknown>).signUp).toBeUndefined();
    });

    it('has no signInWithEmail method', () => {
      const { result } = renderHook(() => useAuthStore());
      expect(
        (result.current as unknown as Record<string, unknown>).signInWithEmail,
      ).toBeUndefined();
    });
  });

  describe('clearError', () => {
    it('clears the error state', () => {
      act(() => {
        useAuthStore.setState({ error: 'Some error' });
      });

      const { result } = renderHook(() => useAuthStore());
      act(() => result.current.clearError());

      expect(result.current.error).toBeNull();
    });
  });

  describe('markOnboardingComplete', () => {
    const dummyProfile = {
      topNutrients: ['fibra', 'proteina', 'ferro'] as NutrientTag[],
      suggestedIngredients: [],
    };

    it('upserts onboarding_completed=true and bioactive_profile, sets onboardingCompleted in store', async () => {
      const mockUpsert = jest.fn().mockResolvedValue({ data: null, error: null });
      supabase.from.mockReturnValue({ upsert: mockUpsert });

      act(() => {
        useAuthStore.setState({
          user: { id: 'user-123', name: 'Test', email: 'test@test.com', createdAt: '' },
          onboardingCompleted: false,
        });
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.markOnboardingComplete(dummyProfile);
      });

      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockUpsert).toHaveBeenCalledWith({
        id: 'user-123',
        onboarding_completed: true,
        bioactive_profile: dummyProfile,
      });
      expect(result.current.onboardingCompleted).toBe(true);
    });

    it('does nothing when user is not authenticated', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.markOnboardingComplete(dummyProfile);
      });

      expect(supabase.from).not.toHaveBeenCalled();
      expect(result.current.onboardingCompleted).toBe(false);
    });
  });

  describe('signOut', () => {
    it('calls supabase.auth.signOut and clears user', async () => {
      supabase.auth.signOut.mockResolvedValue({});
      act(() => {
        useAuthStore.setState({
          user: { id: '1', name: 'Test', email: 'test@test.com', createdAt: '' },
        });
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.signOut();
      });

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });
  });
});
