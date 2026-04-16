import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import SettingsScreen from '../settings';

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), replace: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

const mockUpdateName = jest.fn();
const mockSignOut = jest.fn();

jest.mock('@/stores/useAuthStore', () => ({
  useAuthStore: () => ({
    user: {
      id: 'user-1',
      name: 'Maria Silva',
      email: 'maria@example.com',
      createdAt: '2025-01-01T00:00:00Z',
    },
    signOut: mockSignOut,
  }),
}));

jest.mock('@/stores/useProfileStore', () => ({
  useProfileStore: () => ({
    updateName: mockUpdateName,
  }),
}));

beforeEach(() => {
  mockUpdateName.mockReset();
  mockSignOut.mockReset();
});

describe('SettingsScreen', () => {
  it('pré-preenche o campo com o nome do usuário', () => {
    const { getByDisplayValue } = render(<SettingsScreen />);
    expect(getByDisplayValue('Maria Silva')).toBeTruthy();
  });

  it('exibe erro inline ao tentar salvar com campo vazio', async () => {
    const { getByDisplayValue, getByText } = render(<SettingsScreen />);

    fireEvent.changeText(getByDisplayValue('Maria Silva'), '');
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(getByText('O nome não pode ser vazio.')).toBeTruthy();
    });
    expect(mockUpdateName).not.toHaveBeenCalled();
  });

  it('chama updateName com nome trimado ao salvar com sucesso', async () => {
    mockUpdateName.mockResolvedValue(undefined);
    const { getByDisplayValue, getByText } = render(<SettingsScreen />);

    fireEvent.changeText(getByDisplayValue('Maria Silva'), '  Novo Nome  ');
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(mockUpdateName).toHaveBeenCalledWith('user-1', 'Novo Nome');
    });
    expect(getByText('Nome atualizado com sucesso!')).toBeTruthy();
  });

  it('exibe mensagem de erro quando updateName lança exceção', async () => {
    mockUpdateName.mockRejectedValue(new Error('Falha'));
    const { getByDisplayValue, getByText } = render(<SettingsScreen />);

    fireEvent.changeText(getByDisplayValue('Maria Silva'), 'Outro Nome');
    fireEvent.press(getByText('Salvar'));

    await waitFor(() => {
      expect(getByText('Não foi possível salvar. Tente novamente.')).toBeTruthy();
    });
  });
});
