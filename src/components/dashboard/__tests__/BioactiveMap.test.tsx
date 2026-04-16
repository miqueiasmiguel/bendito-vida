import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import type { Ingredient } from '@/data/ingredients';
import type { NutrientTag } from '@/data/quiz-questions';

import { BioactiveMap } from '../BioactiveMap';

// BioactiveMap now renders BioactiveRadarChart which uses react-native-svg.
// Mock SVG so Text labels render as native Text (findable by getByText).
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Svg: ({ children }: { children: React.ReactNode }) => React.createElement(View, null, children),
    Path: () => null,
    Polygon: () => null,
    Circle: () => null,
    Line: () => null,
    Text: ({ children }: { children: React.ReactNode }) =>
      React.createElement(Text, null, children),
  };
});

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

  it('renders radar chart labels when nutrients provided', () => {
    const { getByText } = render(
      <BioactiveMap topNutrients={nutrients} recommendedIngredients={[]} />,
    );
    // Short labels as mapped by NUTRIENT_SHORT
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

  it('shows leaf seal for paraiban ingredients', () => {
    const { getAllByLabelText } = render(
      <BioactiveMap
        topNutrients={nutrients}
        recommendedIngredients={[paraibanoIngredient, nonParaibanoIngredient]}
      />,
    );
    expect(getAllByLabelText('Ingrediente paraibano')).toHaveLength(1);
  });

  it('shows no leaf seal for non-paraiban ingredients', () => {
    const { queryByLabelText } = render(
      <BioactiveMap topNutrients={nutrients} recommendedIngredients={[nonParaibanoIngredient]} />,
    );
    expect(queryByLabelText('Ingrediente paraibano')).toBeNull();
  });

  it('displays at most 6 nutrients even when more are given', () => {
    const manyNutrients: NutrientTag[] = [
      'omega3',
      'fibra',
      'calcio',
      'ferro',
      'zinco',
      'selenio',
      'cromo',
    ];
    const { queryByText } = render(
      <BioactiveMap topNutrients={manyNutrients} recommendedIngredients={[]} />,
    );
    // 7th nutrient (index 6 = 'cromo') should not be shown
    expect(queryByText('Cromo')).toBeNull();
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

  // Context menu — three-dot button
  it('renders the three-dot menu button', () => {
    const { getByLabelText } = render(
      <BioactiveMap topNutrients={nutrients} recommendedIngredients={[]} />,
    );
    expect(getByLabelText('Opções do Mapa Bioativo')).toBeTruthy();
  });

  it('renders the three-dot menu button in empty state too', () => {
    const { getByLabelText } = render(
      <BioactiveMap topNutrients={[]} recommendedIngredients={[]} />,
    );
    expect(getByLabelText('Opções do Mapa Bioativo')).toBeTruthy();
  });

  it('opens modal with "Refazer quiz" and "Cancelar" when menu button is pressed', () => {
    const { getByLabelText, getByText } = render(
      <BioactiveMap topNutrients={nutrients} recommendedIngredients={[]} />,
    );
    fireEvent.press(getByLabelText('Opções do Mapa Bioativo'));
    expect(getByText('Refazer quiz')).toBeTruthy();
    expect(getByText('Cancelar')).toBeTruthy();
  });

  it('calls onRetakeQuiz when "Refazer quiz" is pressed', () => {
    const onRetakeQuiz = jest.fn();
    const { getByLabelText } = render(
      <BioactiveMap
        topNutrients={nutrients}
        recommendedIngredients={[]}
        onRetakeQuiz={onRetakeQuiz}
      />,
    );
    fireEvent.press(getByLabelText('Opções do Mapa Bioativo'));
    fireEvent.press(getByLabelText('Refazer quiz'));
    expect(onRetakeQuiz).toHaveBeenCalledTimes(1);
  });

  it('closes modal without calling onRetakeQuiz when "Cancelar" is pressed', () => {
    const onRetakeQuiz = jest.fn();
    const { getByLabelText, queryByText } = render(
      <BioactiveMap
        topNutrients={nutrients}
        recommendedIngredients={[]}
        onRetakeQuiz={onRetakeQuiz}
      />,
    );
    fireEvent.press(getByLabelText('Opções do Mapa Bioativo'));
    fireEvent.press(getByLabelText('Cancelar'));
    expect(onRetakeQuiz).not.toHaveBeenCalled();
    expect(queryByText('Refazer quiz')).toBeNull();
  });
});
