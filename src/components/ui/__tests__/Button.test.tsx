import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { Button } from '../Button';

describe('Button', () => {
  it('renders primary variant with correct label', () => {
    const { getByRole } = render(<Button variant="primary" label="Começar" onPress={() => {}} />);
    expect(getByRole('button', { name: 'Começar' })).toBeTruthy();
  });

  it('renders secondary variant with correct label', () => {
    const { getByRole } = render(
      <Button variant="secondary" label="Cancelar" onPress={() => {}} />,
    );
    expect(getByRole('button', { name: 'Cancelar' })).toBeTruthy();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button variant="primary" label="Disabled" onPress={onPress} disabled />,
    );
    fireEvent.press(getByRole('button', { name: 'Disabled' }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('calls onPress when not disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button variant="primary" label="Press me" onPress={onPress} />);
    fireEvent.press(getByRole('button', { name: 'Press me' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
