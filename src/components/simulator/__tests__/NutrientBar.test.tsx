import { render } from '@testing-library/react-native';
import React from 'react';

import { NutrientBar } from '../NutrientBar';

describe('NutrientBar', () => {
  it('renders label and value', () => {
    const { getByText } = render(
      <NutrientBar label="Fibras" value={5.5} unit="g" maxValue={25} color="#4CAF50" />,
    );
    expect(getByText('Fibras')).toBeTruthy();
    expect(getByText('5.5')).toBeTruthy();
  });

  it('renders integer value without decimal', () => {
    const { getByText } = render(
      <NutrientBar label="Calorias" value={300} unit="kcal" maxValue={600} color="#E53935" />,
    );
    expect(getByText('300')).toBeTruthy();
  });

  it('renders zero value', () => {
    const { getByText } = render(
      <NutrientBar label="Ômega-3" value={0} unit="g" maxValue={10} color="#B8860B" />,
    );
    expect(getByText('0')).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(
      <NutrientBar label="Proteínas" value={12.5} unit="g" maxValue={50} color="#42A5F5" />,
    );
    expect(getByLabelText('Proteínas: 12.5 g')).toBeTruthy();
  });
});
