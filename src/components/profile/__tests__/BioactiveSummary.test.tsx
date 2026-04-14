import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { BioactiveSummary } from '../BioactiveSummary';
import type { NutritionProfile } from '@/utils/match-profile';

const mockProfile: NutritionProfile = {
  topNutrients: ['ferro', 'fibra', 'proteina'],
  suggestedIngredients: [],
};

describe('BioactiveSummary', () => {
  it('exibe os 3 nutrientes quando profile está preenchido', () => {
    const { getByLabelText } = render(
      <BioactiveSummary profile={mockProfile} onQuizPress={() => {}} />,
    );

    expect(getByLabelText('Ferro')).toBeTruthy();
    expect(getByLabelText('Fibra')).toBeTruthy();
    expect(getByLabelText('Proteína')).toBeTruthy();
  });

  it('exibe no máximo 3 nutrientes mesmo que profile tenha mais', () => {
    const profileWith5: NutritionProfile = {
      topNutrients: ['ferro', 'fibra', 'proteina', 'calcio', 'omega3'],
      suggestedIngredients: [],
    };
    const { getByLabelText, queryByLabelText } = render(
      <BioactiveSummary profile={profileWith5} onQuizPress={() => {}} />,
    );
    expect(getByLabelText('Ferro')).toBeTruthy();
    expect(getByLabelText('Fibra')).toBeTruthy();
    expect(getByLabelText('Proteína')).toBeTruthy();
    expect(queryByLabelText('Cálcio')).toBeNull();
  });

  it('exibe CTA quando profile é null', () => {
    const { getByText, getByRole } = render(
      <BioactiveSummary profile={null} onQuizPress={() => {}} />,
    );
    expect(getByText('Complete o quiz para ver seu Mapa Bioativo')).toBeTruthy();
    expect(getByRole('button', { name: 'Fazer Quiz' })).toBeTruthy();
  });

  it('exibe CTA quando topNutrients está vazio', () => {
    const emptyProfile: NutritionProfile = { topNutrients: [], suggestedIngredients: [] };
    const { getByText } = render(
      <BioactiveSummary profile={emptyProfile} onQuizPress={() => {}} />,
    );
    expect(getByText('Complete o quiz para ver seu Mapa Bioativo')).toBeTruthy();
  });

  it('chama onQuizPress ao pressionar o botão', () => {
    const onQuizPress = jest.fn();
    const { getByRole } = render(<BioactiveSummary profile={null} onQuizPress={onQuizPress} />);
    fireEvent.press(getByRole('button', { name: 'Fazer Quiz' }));
    expect(onQuizPress).toHaveBeenCalledTimes(1);
  });
});
