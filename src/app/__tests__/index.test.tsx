import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import WelcomeScreen from '../index';

jest.mock('expo-router', () => ({
  router: { replace: jest.fn() },
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: jest.fn(),
}));

jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'bendito-vida://auth/callback'),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the auth store
const mockSignInWithGoogle = jest.fn();
const mockClearError = jest.fn();

let mockStoreState = {
  user: null as null | object,
  isLoading: false,
  error: null as null | string,
  sessionChecked: true,
  signInWithGoogle: mockSignInWithGoogle,
  clearError: mockClearError,
};

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: jest.fn(() => mockStoreState),
}));

beforeEach(() => {
  mockStoreState = {
    user: null,
    isLoading: false,
    error: null,
    sessionChecked: true,
    signInWithGoogle: mockSignInWithGoogle,
    clearError: mockClearError,
  };
  jest.clearAllMocks();
});

describe('WelcomeScreen', () => {
  describe('renderização', () => {
    it('exibe o botão "Entrar com Google"', () => {
      const { getByRole } = render(<WelcomeScreen />);
      expect(getByRole('button', { name: 'Entrar com Google' })).toBeTruthy();
    });

    it('não exibe botão "Começar"', () => {
      const { queryByRole } = render(<WelcomeScreen />);
      expect(queryByRole('button', { name: 'Começar' })).toBeNull();
    });

    it('não exibe link "Já tenho conta"', () => {
      const { queryByRole } = render(<WelcomeScreen />);
      expect(queryByRole('link', { name: 'Já tenho conta' })).toBeNull();
    });

    it('exibe o nome do app', () => {
      const { getByText } = render(<WelcomeScreen />);
      expect(getByText('Bendito Vida')).toBeTruthy();
    });
  });

  describe('loading', () => {
    it('desabilita o botão durante o fluxo OAuth', () => {
      mockStoreState = { ...mockStoreState, isLoading: true };
      const { getByRole } = render(<WelcomeScreen />);
      const btn = getByRole('button', { name: 'Entrar com Google' });
      expect(btn.props.accessibilityState?.disabled).toBe(true);
    });

    it('exibe ActivityIndicator durante loading', () => {
      mockStoreState = { ...mockStoreState, isLoading: true };
      const { getByLabelText } = render(<WelcomeScreen />);
      expect(getByLabelText('Carregando autenticação')).toBeTruthy();
    });
  });

  describe('erro', () => {
    it('exibe mensagem de erro quando error está definido', () => {
      mockStoreState = { ...mockStoreState, error: 'Erro ao autenticar com Google' };
      const { getByText } = render(<WelcomeScreen />);
      expect(getByText('Erro ao autenticar com Google')).toBeTruthy();
    });

    it('chama clearError ao pressionar "Fechar"', () => {
      mockStoreState = { ...mockStoreState, error: 'Algum erro' };
      const { getByText } = render(<WelcomeScreen />);
      fireEvent.press(getByText('Fechar'));
      expect(mockClearError).toHaveBeenCalledTimes(1);
    });
  });

  describe('autenticação', () => {
    it('chama signInWithGoogle ao pressionar o botão', () => {
      const { getByRole } = render(<WelcomeScreen />);
      fireEvent.press(getByRole('button', { name: 'Entrar com Google' }));
      expect(mockSignInWithGoogle).toHaveBeenCalledTimes(1);
    });

    it('redireciona para /(tabs)/home quando user é definido', () => {
      const { router } = require('expo-router');
      mockStoreState = {
        ...mockStoreState,
        user: { id: '1', name: 'User', email: 'u@u.com', createdAt: '' },
        sessionChecked: true,
      };
      render(<WelcomeScreen />);
      expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
    });
  });

  describe('sessão inicial', () => {
    it('exibe spinner enquanto sessionChecked é false', () => {
      mockStoreState = { ...mockStoreState, sessionChecked: false };
      const { queryByRole } = render(<WelcomeScreen />);
      // The main content (Google button) should not be visible
      expect(queryByRole('button', { name: 'Entrar com Google' })).toBeNull();
    });
  });
});
