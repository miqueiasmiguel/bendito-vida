import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

import type { DailyCheckin } from '@/types/database';

import { TodayStatusCard } from '../TodayStatusCard';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

const makeCheckin = (overrides: Partial<DailyCheckin> = {}): DailyCheckin => ({
  id: '1',
  user_id: 'u1',
  date: '2026-04-20',
  energy_score: 4,
  sleep_score: 3,
  focus_score: 5,
  created_at: '2026-04-20T10:00:00Z',
  ...overrides,
});

describe('TodayStatusCard', () => {
  it('renders scores when checkin is provided', () => {
    const { getByText } = render(<TodayStatusCard checkin={makeCheckin()} />);
    expect(getByText('4')).toBeTruthy();
    expect(getByText('Energia')).toBeTruthy();
    expect(getByText('Check-in de hoje realizado ✓')).toBeTruthy();
  });

  it('renders CTA state when checkin is undefined', () => {
    const { getByText } = render(<TodayStatusCard checkin={undefined} />);
    expect(getByText('Como você está hoje?')).toBeTruthy();
    expect(getByText('Registrar meu dia')).toBeTruthy();
  });

  it('renders CTA state when checkin is null', () => {
    const { getByText } = render(<TodayStatusCard checkin={null} />);
    expect(getByText('Como você está hoje?')).toBeTruthy();
  });

  it('calls onPress when card with checkin is pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<TodayStatusCard checkin={makeCheckin()} onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
