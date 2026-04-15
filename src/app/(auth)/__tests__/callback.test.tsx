import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import AuthCallbackScreen from '../callback';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({ code: 'test-code-123' })),
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      exchangeCodeForSession: jest.fn(),
    },
  },
}));

const { router, useLocalSearchParams } = require('expo-router') as {
  router: { replace: jest.Mock };
  useLocalSearchParams: jest.Mock;
};
const { supabase } = require('@/lib/supabase') as {
  supabase: { auth: { exchangeCodeForSession: jest.Mock } };
};

beforeEach(() => {
  jest.clearAllMocks();
  useLocalSearchParams.mockReturnValue({ code: 'test-code-123' });
});

describe('AuthCallbackScreen', () => {
  it('renders activity indicator while processing', () => {
    supabase.auth.exchangeCodeForSession.mockReturnValue(new Promise(() => {}));
    const { getByTestId } = render(<AuthCallbackScreen />);
    expect(getByTestId('auth-callback-loading')).toBeTruthy();
  });

  it('calls exchangeCodeForSession with the code param', async () => {
    supabase.auth.exchangeCodeForSession.mockResolvedValue({ data: {}, error: null });

    render(<AuthCallbackScreen />);

    await waitFor(() => {
      expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('test-code-123');
    });
  });

  it('navigates to /(tabs)/home on success', async () => {
    supabase.auth.exchangeCodeForSession.mockResolvedValue({ data: {}, error: null });

    render(<AuthCallbackScreen />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
    });
  });

  it('navigates to / when no code is provided', async () => {
    useLocalSearchParams.mockReturnValue({});

    render(<AuthCallbackScreen />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/');
    });
    expect(supabase.auth.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('navigates to / when exchangeCodeForSession returns an error', async () => {
    supabase.auth.exchangeCodeForSession.mockResolvedValue({
      data: null,
      error: { message: 'PKCE error' },
    });

    render(<AuthCallbackScreen />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/');
    });
  });
});
