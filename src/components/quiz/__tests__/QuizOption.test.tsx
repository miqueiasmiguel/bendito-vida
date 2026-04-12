import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { QuizOption } from '../QuizOption';

describe('QuizOption', () => {
  it('renders the label text', () => {
    const { getByText } = render(
      <QuizOption label="Mais energia" selected={false} onPress={() => {}} />,
    );
    expect(getByText('Mais energia')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <QuizOption label="Mais energia" selected={false} onPress={onPress} />,
    );
    fireEvent.press(getByRole('button', { name: 'Mais energia' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('exposes accessibilityState.selected=false when not selected', () => {
    const { getByRole } = render(
      <QuizOption label="Foco mental" selected={false} onPress={() => {}} />,
    );
    const btn = getByRole('button', { name: 'Foco mental' });
    expect(btn.props.accessibilityState?.selected).toBe(false);
  });

  it('exposes accessibilityState.selected=true when selected', () => {
    const { getByRole } = render(
      <QuizOption label="Foco mental" selected={true} onPress={() => {}} />,
    );
    const btn = getByRole('button', { name: 'Foco mental' });
    expect(btn.props.accessibilityState?.selected).toBe(true);
  });
});
