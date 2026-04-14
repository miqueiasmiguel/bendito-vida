import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import type { Ingredient } from '@/data/ingredients';

import { IngredientCard } from '../IngredientCard';

const mockIngredient: Ingredient = {
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

describe('IngredientCard', () => {
  it('renders ingredient name', () => {
    const { getByText } = render(
      <IngredientCard ingredient={mockIngredient} selected={false} onPress={jest.fn()} />,
    );
    expect(getByText('Gergelim')).toBeTruthy();
  });

  it('shows paraibano seal icon for paraiban ingredients', () => {
    const { getByLabelText, queryByText } = render(
      <IngredientCard ingredient={mockIngredient} selected={false} onPress={jest.fn()} />,
    );
    expect(getByLabelText('Ingrediente paraibano')).toBeTruthy();
    expect(queryByText('Paraibano')).toBeNull();
  });

  it('hides paraibano seal for non-paraiban ingredients', () => {
    const { queryByLabelText } = render(
      <IngredientCard ingredient={nonParaibanoIngredient} selected={false} onPress={jest.fn()} />,
    );
    expect(queryByLabelText('Ingrediente paraibano')).toBeNull();
  });

  it('calls onPress with ingredient when tapped', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <IngredientCard ingredient={mockIngredient} selected={false} onPress={onPress} />,
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledWith(mockIngredient);
  });

  it('shows selected accessibility state when selected', () => {
    const { getByRole } = render(
      <IngredientCard ingredient={mockIngredient} selected={true} onPress={jest.fn()} />,
    );
    expect(getByRole('button').props.accessibilityState?.selected).toBe(true);
  });

  it('displays calorie information', () => {
    const { getByText } = render(
      <IngredientCard ingredient={mockIngredient} selected={false} onPress={jest.fn()} />,
    );
    expect(getByText('172 kcal')).toBeTruthy();
  });
});
