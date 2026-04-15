import { render } from '@testing-library/react-native';
import React from 'react';

import { SavedMixCard } from '../SavedMixCard';
import type { Mix } from '@/types/database';

const baseMix: Mix = {
  id: 'mix-1',
  user_id: 'user-1',
  name: 'Mix Energético',
  created_at: '2026-04-10T12:00:00Z',
  ingredients: ['gergelim', 'feijao-verde'],
  nutrition: { calories: 200, fiber: 5, protein: 10, omega3: 1 },
};

describe('SavedMixCard', () => {
  it('exibe nome e sumário nutricional', () => {
    const { getByText } = render(<SavedMixCard mix={baseMix} />);
    expect(getByText('Mix Energético')).toBeTruthy();
    expect(getByText('200 kcal')).toBeTruthy();
    expect(getByText('10g proteína')).toBeTruthy();
  });

  it('exibe ingredientes sem "+N" quando há 2 ou menos', () => {
    const { getByText, queryByText } = render(<SavedMixCard mix={baseMix} />);
    // gergelim and feijao-verde — names from INGREDIENTS data
    const ingredientsText = getByText(/Gergelim/i);
    expect(ingredientsText).toBeTruthy();
    // No "+N" extra indicator
    expect(queryByText(/\+\d/)).toBeNull();
  });

  it('trunca com "+N" quando há mais de 3 ingredientes', () => {
    const mixWith5: Mix = {
      ...baseMix,
      ingredients: ['gergelim', 'feijao-verde', 'amendoim', 'linhaça', 'chia'],
    };
    const { getByText } = render(<SavedMixCard mix={mixWith5} />);
    expect(getByText(/\+2/)).toBeTruthy();
  });

  it('tem accessibilityLabel correto', () => {
    const { getByLabelText } = render(<SavedMixCard mix={baseMix} />);
    expect(getByLabelText(/Mix Energético/)).toBeTruthy();
  });
});
