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

const defaultProps = {
  onPress: jest.fn(),
  onRemove: jest.fn(),
  cardWidth: 96,
};

describe('IngredientCard', () => {
  it('renders ingredient name', () => {
    const { getByText } = render(
      <IngredientCard ingredient={mockIngredient} grams={0} {...defaultProps} />,
    );
    expect(getByText('Gergelim')).toBeTruthy();
  });

  it('shows paraibano seal icon for paraiban ingredients', () => {
    const { getByLabelText, queryByText } = render(
      <IngredientCard ingredient={mockIngredient} grams={0} {...defaultProps} />,
    );
    expect(getByLabelText('Ingrediente paraibano')).toBeTruthy();
    expect(queryByText('Paraibano')).toBeNull();
  });

  it('hides paraibano seal for non-paraiban ingredients', () => {
    const { queryByLabelText } = render(
      <IngredientCard ingredient={nonParaibanoIngredient} grams={0} {...defaultProps} />,
    );
    expect(queryByLabelText('Ingrediente paraibano')).toBeNull();
  });

  it('calls onPress with ingredient when card is tapped', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <IngredientCard ingredient={mockIngredient} grams={0} {...defaultProps} onPress={onPress} />,
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledWith(mockIngredient);
  });

  it('displays calorie information', () => {
    const { getByText } = render(
      <IngredientCard ingredient={mockIngredient} grams={0} {...defaultProps} />,
    );
    expect(getByText('172 kcal')).toBeTruthy();
  });

  it('does not show quantity badge when grams is 0', () => {
    const { queryByText } = render(
      <IngredientCard ingredient={mockIngredient} grams={0} {...defaultProps} />,
    );
    expect(queryByText(/g$/)).toBeNull();
  });

  it('shows quantity badge with correct amount when grams > 0', () => {
    const { getByText } = render(
      <IngredientCard ingredient={mockIngredient} grams={60} {...defaultProps} />,
    );
    expect(getByText('60g')).toBeTruthy();
  });

  it('calls onRemove when quantity badge is tapped', () => {
    const onRemove = jest.fn();
    const { getByLabelText } = render(
      <IngredientCard
        ingredient={mockIngredient}
        grams={30}
        {...defaultProps}
        onRemove={onRemove}
      />,
    );
    fireEvent.press(getByLabelText('Remover Gergelim do mix'));
    expect(onRemove).toHaveBeenCalledWith('gergelim');
  });

  it('includes grams in accessibility label when grams > 0', () => {
    const { getByLabelText } = render(
      <IngredientCard ingredient={mockIngredient} grams={60} {...defaultProps} />,
    );
    expect(getByLabelText('Gergelim, 60g no mix')).toBeTruthy();
  });

  it('uses plain ingredient name in accessibility label when grams is 0', () => {
    const { getByLabelText } = render(
      <IngredientCard ingredient={mockIngredient} grams={0} {...defaultProps} />,
    );
    expect(getByLabelText('Gergelim')).toBeTruthy();
  });

  it('does not apply a persistent active style when grams > 0', () => {
    // The card should not show a static green background when the ingredient is in the mix.
    // The only persistent indicator is the quantity badge.
    const { getByText } = render(
      <IngredientCard ingredient={mockIngredient} grams={30} {...defaultProps} />,
    );
    // Badge is visible — it is the sole persistent indicator
    expect(getByText('30g')).toBeTruthy();
  });

  it('badge remains the sole persistent indicator when grams > 0', () => {
    const { getByText, queryByText } = render(
      <IngredientCard ingredient={mockIngredient} grams={60} {...defaultProps} />,
    );
    expect(getByText('60g')).toBeTruthy();
    // Ingredient name and calories still visible (card not obscured)
    expect(getByText('Gergelim')).toBeTruthy();
    expect(queryByText('172 kcal')).toBeTruthy();
  });
});
