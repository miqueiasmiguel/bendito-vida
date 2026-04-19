import { render } from '@testing-library/react-native';
import React from 'react';

import type { Ingredient } from '@/data/ingredients';

import { DailyTip } from '../DailyTip';

const makeIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
  id: 'test',
  name: 'Chia',
  description: 'Semente rica em omega-3.',
  origin: 'Nordeste',
  nutrients: ['omega3'],
  isParaibano: false,
  color: '#2F2F2F',
  nutrition: { calories: 146, fiber: 10.3, protein: 4.9, omega3: 5.4 },
  ...overrides,
});

describe('DailyTip', () => {
  it('renders the ingredient name', () => {
    const { getByText } = render(<DailyTip ingredient={makeIngredient()} />);
    expect(getByText('Chia')).toBeTruthy();
  });

  it('renders "Dica do dia" label', () => {
    const { getByText } = render(<DailyTip ingredient={makeIngredient()} />);
    expect(getByText('Dica do dia')).toBeTruthy();
  });

  it('shows omega3 benefit', () => {
    const { getByText } = render(
      <DailyTip ingredient={makeIngredient({ nutrients: ['omega3'] })} />,
    );
    expect(getByText('Ótimo para o cérebro')).toBeTruthy();
  });

  it('shows fibra benefit', () => {
    const { getByText } = render(
      <DailyTip ingredient={makeIngredient({ nutrients: ['fibra'] })} />,
    );
    expect(getByText('Regula o intestino')).toBeTruthy();
  });

  it('shows proteina benefit', () => {
    const { getByText } = render(
      <DailyTip ingredient={makeIngredient({ nutrients: ['proteina'] })} />,
    );
    expect(getByText('Constrói músculos')).toBeTruthy();
  });

  it('shows ferro benefit', () => {
    const { getByText } = render(
      <DailyTip ingredient={makeIngredient({ nutrients: ['ferro'] })} />,
    );
    expect(getByText('Combate a anemia')).toBeTruthy();
  });

  it('shows calcio benefit', () => {
    const { getByText } = render(
      <DailyTip ingredient={makeIngredient({ nutrients: ['calcio'] })} />,
    );
    expect(getByText('Fortalece os ossos')).toBeTruthy();
  });

  it('shows magnesio benefit', () => {
    const { getByText } = render(
      <DailyTip ingredient={makeIngredient({ nutrients: ['magnesio'] })} />,
    );
    expect(getByText('Ajuda na disposição')).toBeTruthy();
  });

  it('shows zinco benefit', () => {
    const { getByText } = render(
      <DailyTip ingredient={makeIngredient({ nutrients: ['zinco'] })} />,
    );
    expect(getByText('Protege as células')).toBeTruthy();
  });

  it('shows selenio benefit', () => {
    const { getByText } = render(
      <DailyTip ingredient={makeIngredient({ nutrients: ['selenio'] })} />,
    );
    expect(getByText('Ação antioxidante')).toBeTruthy();
  });

  it('shows vitamina-c benefit', () => {
    const { getByText } = render(
      <DailyTip ingredient={makeIngredient({ nutrients: ['vitamina-c'] })} />,
    );
    expect(getByText('Reforça o sistema imune')).toBeTruthy();
  });

  it('falls back to description when nutrient is unknown', () => {
    const { getByText } = render(
      <DailyTip
        ingredient={makeIngredient({ nutrients: [], description: 'Ingrediente especial.' })}
      />,
    );
    expect(getByText('Ingrediente especial.')).toBeTruthy();
  });

  it('has accessibility label with ingredient name', () => {
    const { getByLabelText } = render(<DailyTip ingredient={makeIngredient()} />);
    expect(getByLabelText('Dica do dia: Chia')).toBeTruthy();
  });
});
