import { render } from '@testing-library/react-native';
import React from 'react';

import type { Ingredient } from '@/data/ingredients';
import type { NutrientTag } from '@/data/quiz-questions';

import { BioactiveMap } from '../BioactiveMap';

const paraibanoIngredient: Ingredient = {
  id: 'gergelim',
  name: 'Gergelim',
  description: 'Semente rica em cálcio.',
  origin: 'Paraíba — Cariri Ocidental',
  nutrients: ['calcio', 'omega3', 'ferro'],
  isParaibano: true,
  color: '#F5E6C8',
  nutrition: { calories: 172, fiber: 3.5, protein: 5.3, omega3: 0.1 },
};

const nonParaibanoIngredient: Ingredient = {
  id: 'chia',
  name: 'Chia',
  description: 'Rica em ômega-3.',
  origin: 'Cultivada no Nordeste',
  nutrients: ['omega3', 'fibra', 'calcio'],
  isParaibano: false,
  color: '#2F2F2F',
  nutrition: { calories: 146, fiber: 10.3, protein: 4.9, omega3: 5.4 },
};

const nutrients: NutrientTag[] = ['omega3', 'fibra', 'calcio'];

describe('BioactiveMap', () => {
  it('renders empty state when no nutrients provided', () => {
    const { getByText } = render(<BioactiveMap topNutrients={[]} recommendedIngredients={[]} />);
    expect(getByText(/Complete o quiz/)).toBeTruthy();
  });

  it('renders "Fazer Quiz" link when onQuizPress provided and empty', () => {
    const onQuizPress = jest.fn();
    const { getByText } = render(
      <BioactiveMap topNutrients={[]} recommendedIngredients={[]} onQuizPress={onQuizPress} />,
    );
    expect(getByText('Fazer Quiz →')).toBeTruthy();
  });

  it('renders nutrient labels when nutrients provided', () => {
    const { getByText } = render(
      <BioactiveMap topNutrients={nutrients} recommendedIngredients={[]} />,
    );
    expect(getByText('Ômega-3')).toBeTruthy();
    expect(getByText('Fibras')).toBeTruthy();
    expect(getByText('Cálcio')).toBeTruthy();
  });

  it('renders ingredient names', () => {
    const { getByText } = render(
      <BioactiveMap
        topNutrients={nutrients}
        recommendedIngredients={[paraibanoIngredient, nonParaibanoIngredient]}
      />,
    );
    expect(getByText('Gergelim')).toBeTruthy();
    expect(getByText('Chia')).toBeTruthy();
  });

  it('shows Paraibano badge for paraiban ingredients', () => {
    const { getAllByText } = render(
      <BioactiveMap
        topNutrients={nutrients}
        recommendedIngredients={[paraibanoIngredient, nonParaibanoIngredient]}
      />,
    );
    expect(getAllByText('Paraibano')).toHaveLength(1);
  });

  it('shows no Paraibano badge for non-paraiban ingredients', () => {
    const { queryByText } = render(
      <BioactiveMap topNutrients={nutrients} recommendedIngredients={[nonParaibanoIngredient]} />,
    );
    expect(queryByText('Paraibano')).toBeNull();
  });

  it('displays at most 3 nutrients even when more are given', () => {
    const manyNutrients: NutrientTag[] = ['omega3', 'fibra', 'calcio', 'ferro', 'zinco'];
    const { queryByText } = render(
      <BioactiveMap topNutrients={manyNutrients} recommendedIngredients={[]} />,
    );
    expect(queryByText('Ferro')).toBeNull();
    expect(queryByText('Zinco')).toBeNull();
  });

  it('displays at most 5 ingredients even when more are given', () => {
    const manyIngredients: Ingredient[] = Array.from({ length: 7 }, (_, i) => ({
      id: `ing-${i}`,
      name: `Ingrediente ${i}`,
      description: '',
      origin: 'Nordeste',
      nutrients: ['fibra' as NutrientTag],
      isParaibano: false,
      color: '#CCC',
      nutrition: { calories: 100, fiber: 2, protein: 3, omega3: 0 },
    }));
    const { queryByText } = render(
      <BioactiveMap topNutrients={nutrients} recommendedIngredients={manyIngredients} />,
    );
    expect(queryByText('Ingrediente 5')).toBeNull();
    expect(queryByText('Ingrediente 6')).toBeNull();
  });
});
