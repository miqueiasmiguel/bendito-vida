import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { SimulatorCtaCard } from '../SimulatorCtaCard';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

describe('SimulatorCtaCard', () => {
  it('renders headline', () => {
    const { getByText } = render(<SimulatorCtaCard />);
    expect(getByText('Monte seu Mix do dia')).toBeTruthy();
  });

  it('renders the action button', () => {
    const { getByText } = render(<SimulatorCtaCard />);
    expect(getByText('Montar meu Mix')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(<SimulatorCtaCard onPress={onPress} />);
    fireEvent.press(getByLabelText('Montar meu Mix — acessar simulador'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
