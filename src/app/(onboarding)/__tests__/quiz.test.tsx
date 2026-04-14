import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import QuizScreen from '../quiz';

jest.mock('expo-router', () => ({
  router: { back: jest.fn(), replace: jest.fn() },
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/utils/match-profile', () => ({
  matchProfile: jest.fn(() => ({ primaryGoal: 'energia', tags: [] })),
}));

// Reset Zustand quiz store between tests
beforeEach(() => {
  const { useQuizStore } = require('@/stores/useQuizStore');
  useQuizStore.getState().reset();
  jest.clearAllMocks();
});

describe('QuizScreen — navegação', () => {
  it('oculta o botão "Voltar" na pergunta 1', () => {
    const { queryByRole } = render(<QuizScreen />);
    // The bottom "Voltar" button should not be present on step 0
    expect(queryByRole('button', { name: 'Voltar para a pergunta anterior' })).toBeNull();
  });

  it('exibe o botão "Voltar" nas perguntas 2 em diante', () => {
    const { getByRole, queryByRole } = render(<QuizScreen />);

    // Confirm Voltar is absent at step 0
    expect(queryByRole('button', { name: 'Voltar para a pergunta anterior' })).toBeNull();

    // Select first option of q1 to enable "Próximo"
    const firstOption = getByRole('button', { name: 'Mais energia' });
    fireEvent.press(firstOption);

    // Press "Próximo" to advance to step 1
    const nextButton = getByRole('button', { name: 'Próximo' });
    fireEvent.press(nextButton);

    // "Voltar" button must now be visible
    expect(getByRole('button', { name: 'Voltar para a pergunta anterior' })).toBeTruthy();
  });

  it('toque em "Voltar" retorna à pergunta anterior preservando a seleção', () => {
    const { getByRole, getByText } = render(<QuizScreen />);

    // Step 0: select "Mais energia" (q1)
    fireEvent.press(getByRole('button', { name: 'Mais energia' }));
    // Advance to step 1
    fireEvent.press(getByRole('button', { name: 'Próximo' }));

    // Confirm we are on step 1 (progress shows "2 de N")
    expect(getByText(/2 de/)).toBeTruthy();

    // Press "Voltar" to go back to step 0
    fireEvent.press(getByRole('button', { name: 'Voltar para a pergunta anterior' }));

    // Confirm we returned to step 0 (progress shows "1 de N")
    expect(getByText(/1 de/)).toBeTruthy();

    // Selection on q1 is preserved: "Mais energia" is still selected
    const { useQuizStore } = require('@/stores/useQuizStore');
    const answers = useQuizStore.getState().answers;
    expect(answers['q1']).toContain('q1-energia');
  });
});
