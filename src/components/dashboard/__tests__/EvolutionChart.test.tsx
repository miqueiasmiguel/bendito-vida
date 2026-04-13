import { render } from '@testing-library/react-native';
import React from 'react';

import type { Checkin } from '@/stores/useProgressStore';

import { EvolutionChart } from '../EvolutionChart';

// react-native-chart-kit uses SVG — mock it for tests.
// jest.fn is allowed in mock factories; external imports (like View) are not.
jest.mock('react-native-chart-kit', () => ({
  LineChart: jest.fn(() => null),
}));

const makeCheckin = (weekNo: number, scores = { e: 4, s: 3, f: 5 }): Checkin => ({
  id: `week-${weekNo}`,
  week: `2026-W${String(weekNo).padStart(2, '0')}`,
  energyScore: scores.e,
  sleepScore: scores.s,
  focusScore: scores.f,
  createdAt: weekNo * 1000,
});

describe('EvolutionChart', () => {
  it('renders onboarding banner when no check-ins exist', () => {
    const { getByText } = render(<EvolutionChart checkins={[]} />);
    expect(getByText(/Faça seu primeiro check-in/)).toBeTruthy();
  });

  it('renders the section title (chart area) when check-ins exist', () => {
    const { getByText } = render(<EvolutionChart checkins={[makeCheckin(15)]} />);
    expect(getByText('Evolução semanal')).toBeTruthy();
  });

  it('renders the section title when check-ins exist', () => {
    const { getByText } = render(<EvolutionChart checkins={[makeCheckin(15), makeCheckin(16)]} />);
    expect(getByText('Evolução semanal')).toBeTruthy();
  });

  it('does not show the empty banner when check-ins are provided', () => {
    const { queryByText } = render(<EvolutionChart checkins={[makeCheckin(15)]} />);
    expect(queryByText(/Faça seu primeiro check-in/)).toBeNull();
  });

  it('limits chart to last 8 weeks even with more data (no throw)', () => {
    const many = Array.from({ length: 12 }, (_, i) => makeCheckin(i + 1));
    const { queryByText, getByText } = render(<EvolutionChart checkins={many} />);
    expect(queryByText(/Faça seu primeiro check-in/)).toBeNull();
    expect(getByText('Evolução semanal')).toBeTruthy();
  });
});
