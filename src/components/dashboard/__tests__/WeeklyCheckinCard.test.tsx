import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import { WeeklyCheckinCard } from '../WeeklyCheckinCard';

describe('WeeklyCheckinCard — compact mode', () => {
  it('renders the teaser with "Responder" button', () => {
    const { getByText } = render(<WeeklyCheckinCard compact />);
    expect(getByText('Check-in de hoje')).toBeTruthy();
    expect(getByText('Responder')).toBeTruthy();
  });

  it('calls onPress when "Responder" is tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(<WeeklyCheckinCard compact onPress={onPress} />);
    fireEvent.press(getByText('Responder'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not render scale labels in compact mode', () => {
    const { queryByText } = render(<WeeklyCheckinCard compact />);
    expect(queryByText('Disposição')).toBeNull();
    expect(queryByText('Sono')).toBeNull();
    expect(queryByText('Foco')).toBeNull();
  });

  it('shows "Feito hoje ✓" and hides "Responder" when existingCheckin is provided', () => {
    const existingCheckin = { energyScore: 4, sleepScore: 3, focusScore: 5 };
    const { getByText, queryByText } = render(
      <WeeklyCheckinCard compact existingCheckin={existingCheckin} />,
    );
    expect(getByText('Feito hoje ✓')).toBeTruthy();
    expect(queryByText('Responder')).toBeNull();
  });
});

describe('WeeklyCheckinCard — full form mode', () => {
  it('renders all three scale labels', () => {
    const { getByText } = render(<WeeklyCheckinCard />);
    expect(getByText('Disposição')).toBeTruthy();
    expect(getByText('Sono')).toBeTruthy();
    expect(getByText('Foco')).toBeTruthy();
  });

  it('"Registrar" button does nothing when no scales selected (disabled behavior)', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<WeeklyCheckinCard onSubmit={onSubmit} />);
    fireEvent.press(getByText('Registrar'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct scores when all three scales are selected', () => {
    const onSubmit = jest.fn();
    const { getAllByText, getByText } = render(<WeeklyCheckinCard onSubmit={onSubmit} />);
    // Each scale row has dots labeled 1-5. Select "3" in each row (3 occurrences).
    const threes = getAllByText('3');
    threes.forEach((btn) => fireEvent.press(btn));

    fireEvent.press(getByText('Registrar'));
    expect(onSubmit).toHaveBeenCalledWith({
      energyScore: 3,
      sleepScore: 3,
      focusScore: 3,
    });
  });

  it('does not call onSubmit when button is disabled (no scores selected)', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(<WeeklyCheckinCard onSubmit={onSubmit} />);
    fireEvent.press(getByText('Registrar'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit once all three scores are selected and button pressed', () => {
    const onSubmit = jest.fn();
    const { getAllByText, getByText } = render(<WeeklyCheckinCard onSubmit={onSubmit} />);
    getAllByText('4').forEach((btn) => fireEvent.press(btn));
    fireEvent.press(getByText('Registrar'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('WeeklyCheckinCard — read-only mode (existingCheckin)', () => {
  const existingCheckin = { energyScore: 4, sleepScore: 3, focusScore: 5 };

  it('shows the done confirmation message', () => {
    const { getByText } = render(<WeeklyCheckinCard existingCheckin={existingCheckin} />);
    expect(getByText(/Check-in de hoje realizado/)).toBeTruthy();
  });

  it('does not render the submit button', () => {
    const { queryByText } = render(<WeeklyCheckinCard existingCheckin={existingCheckin} />);
    expect(queryByText('Registrar')).toBeNull();
  });

  it('renders scale labels in read-only mode', () => {
    const { getByText } = render(<WeeklyCheckinCard existingCheckin={existingCheckin} />);
    expect(getByText('Disposição')).toBeTruthy();
    expect(getByText('Sono')).toBeTruthy();
    expect(getByText('Foco')).toBeTruthy();
  });
});
