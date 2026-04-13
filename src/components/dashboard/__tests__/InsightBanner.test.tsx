import { render } from '@testing-library/react-native';
import React from 'react';

import type { Checkin } from '@/stores/useProgressStore';

import { InsightBanner } from '../InsightBanner';

const makeCheckin = (weekNo: number, energy: number, sleep: number, focus: number): Checkin => ({
  id: `w${weekNo}`,
  week: `2026-W${String(weekNo).padStart(2, '0')}`,
  energyScore: energy,
  sleepScore: sleep,
  focusScore: focus,
  createdAt: weekNo * 1000,
});

describe('InsightBanner', () => {
  it('shows neutral message when there is only one check-in', () => {
    const { getByText } = render(<InsightBanner checkins={[makeCheckin(15, 4, 4, 4)]} />);
    expect(getByText(/Continue registrando/)).toBeTruthy();
  });

  it('shows neutral message when there are no check-ins', () => {
    const { getByText } = render(<InsightBanner checkins={[]} />);
    expect(getByText(/Continue registrando/)).toBeTruthy();
  });

  it('shows improvement message when latest score is higher', () => {
    // prev avg = (2+2+2)/3 = 2.0, latest avg = (4+4+4)/3 = 4.0 → +100%
    const { getByText } = render(
      <InsightBanner checkins={[makeCheckin(14, 2, 2, 2), makeCheckin(15, 4, 4, 4)]} />,
    );
    expect(getByText(/melhorou 100%/)).toBeTruthy();
    expect(getByText(/Continue assim/)).toBeTruthy();
  });

  it('shows decline message when latest score is lower', () => {
    // prev avg = 5, latest avg = 2
    const { getByText } = render(
      <InsightBanner checkins={[makeCheckin(14, 5, 5, 5), makeCheckin(15, 2, 2, 2)]} />,
    );
    expect(getByText(/mais desafiadora/)).toBeTruthy();
  });

  it('shows neutral message when scores are equal', () => {
    const { getByText } = render(
      <InsightBanner checkins={[makeCheckin(14, 3, 3, 3), makeCheckin(15, 3, 3, 3)]} />,
    );
    expect(getByText(/Continue registrando/)).toBeTruthy();
  });
});
