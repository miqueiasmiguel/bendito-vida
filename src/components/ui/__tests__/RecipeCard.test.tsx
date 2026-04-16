import { render } from '@testing-library/react-native';
import React from 'react';

import type { NutritionSummary } from '@/data/nutrition-engine';
import type { MixItem } from '@/stores/useSimulatorStore';

import { RecipeCard } from '../RecipeCard';

const paraibanoItem: MixItem = {
  ingredient: {
    id: 'gergelim',
    name: 'Gergelim',
    description: 'Semente rica em cálcio.',
    origin: 'Paraíba — Cariri Ocidental',
    nutrients: ['calcio', 'omega3', 'ferro'],
    isParaibano: true,
    color: '#F5E6C8',
    nutrition: { calories: 172, fiber: 3.5, protein: 5.3, omega3: 0.1 },
  },
  grams: 30,
};

const nonParaibanoItem: MixItem = {
  ingredient: {
    id: 'chia',
    name: 'Chia',
    description: 'Rica em ômega-3.',
    origin: 'Cultivada no Nordeste',
    nutrients: ['omega3', 'fibra', 'calcio'],
    isParaibano: false,
    color: '#2F2F2F',
    nutrition: { calories: 146, fiber: 10.3, protein: 4.9, omega3: 5.4 },
  },
  grams: 30,
};

const mockNutrition: NutritionSummary = {
  calories: 318,
  fiber: 13.8,
  protein: 10.2,
  omega3: 5.5,
};

describe('RecipeCard', () => {
  it('renders the recipe title', () => {
    const { getByText } = render(
      <RecipeCard
        title="Mix Energia de João"
        ingredients={[paraibanoItem]}
        nutrition={mockNutrition}
      />,
    );
    expect(getByText('Mix Energia de João')).toBeTruthy();
  });

  it('renders all ingredient names', () => {
    const { getByText } = render(
      <RecipeCard
        title="Meu Mix"
        ingredients={[paraibanoItem, nonParaibanoItem]}
        nutrition={mockNutrition}
      />,
    );
    expect(getByText('Gergelim')).toBeTruthy();
    expect(getByText('Chia')).toBeTruthy();
  });

  it('shows paraibano badge when mix has paraiban ingredient', () => {
    const { getByLabelText } = render(
      <RecipeCard title="Meu Mix" ingredients={[paraibanoItem]} nutrition={mockNutrition} />,
    );
    expect(getByLabelText('Contém ingredientes da biodiversidade paraibana')).toBeTruthy();
  });

  it('hides paraibano badge when mix has no paraiban ingredients', () => {
    const { queryByLabelText } = render(
      <RecipeCard title="Meu Mix" ingredients={[nonParaibanoItem]} nutrition={mockNutrition} />,
    );
    expect(queryByLabelText('Contém ingredientes da biodiversidade paraibana')).toBeNull();
  });

  it('renders nutritional summary values', () => {
    const { getByText } = render(
      <RecipeCard title="Meu Mix" ingredients={[paraibanoItem]} nutrition={mockNutrition} />,
    );
    expect(getByText('318')).toBeTruthy(); // calories
    expect(getByText('13.8')).toBeTruthy(); // fiber
  });

  it('shows actual grams and scaled calories for 30g ingredient', () => {
    const { getByText } = render(
      <RecipeCard title="Meu Mix" ingredients={[paraibanoItem]} nutrition={mockNutrition} />,
    );
    // gergelim: 172 kcal/100g × 30g / 100 = 51.6 → 52 kcal
    expect(getByText('30g')).toBeTruthy();
    expect(getByText('52 kcal')).toBeTruthy();
  });

  it('shows 60g and doubled calories when ingredient added twice', () => {
    const doubledItem: MixItem = { ...paraibanoItem, grams: 60 };
    const { getByText } = render(
      <RecipeCard title="Meu Mix" ingredients={[doubledItem]} nutrition={mockNutrition} />,
    );
    // gergelim: 172 kcal/100g × 60g / 100 = 103.2 → 103 kcal
    expect(getByText('60g')).toBeTruthy();
    expect(getByText('103 kcal')).toBeTruthy();
  });
});
