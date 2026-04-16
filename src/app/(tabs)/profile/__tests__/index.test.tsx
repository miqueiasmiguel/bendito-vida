import { render } from '@testing-library/react-native';
import React from 'react';

import ProfileScreen from '../index';

jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: () => ({
    user: {
      id: 'user-1',
      name: 'Maria Silva',
      email: 'maria@example.com',
      createdAt: '2025-01-01T00:00:00Z',
    },
  }),
}));

jest.mock('@/stores/useQuizStore', () => ({
  useQuizStore: (selector: (s: unknown) => unknown) => selector({ nutritionProfile: null }),
}));

jest.mock('@/stores/useProfileStore', () => ({
  useProfileStore: () => ({
    mixes: [],
    fetchProfile: jest.fn(),
  }),
}));

jest.mock('@/components/dashboard/BioactiveMap', () => {
  const { View, Text } = require('react-native');
  return {
    BioactiveMap: () => (
      <View>
        <Text>BioactiveMap</Text>
      </View>
    ),
  };
});

describe('ProfileScreen (hub)', () => {
  it('renderiza o nome do usuário', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Maria Silva')).toBeTruthy();
  });

  it('renderiza os cards de estatísticas', () => {
    const { getByLabelText } = render(<ProfileScreen />);
    expect(getByLabelText('0 mixes criados')).toBeTruthy();
  });

  it('renderiza o BioactiveMap', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('BioactiveMap')).toBeTruthy();
  });

  it('renderiza os itens de navegação', () => {
    const { getByRole } = render(<ProfileScreen />);
    expect(getByRole('button', { name: 'Meus Mixes' })).toBeTruthy();
    expect(getByRole('button', { name: 'Configurações' })).toBeTruthy();
  });
});
