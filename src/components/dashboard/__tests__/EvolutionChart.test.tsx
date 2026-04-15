import { render } from '@testing-library/react-native';
import React from 'react';

import type { DailyCheckin } from '@/types/database';

import { EvolutionChart } from '../EvolutionChart';

// react-native-chart-kit uses SVG — mock it for tests.
// jest.fn is allowed in mock factories; external imports (like View) are not.
jest.mock('react-native-chart-kit', () => ({
  LineChart: jest.fn(() => null),
}));

const makeCheckin = (dayOffset: number, scores = { e: 4, s: 3, f: 5 }): DailyCheckin => {
  const d = new Date(2026, 3, 1 + dayOffset); // April 2026
  const dateStr = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
  return {
    id: `day-${dayOffset}`,
    user_id: 'user-1',
    date: dateStr,
    energy_score: scores.e,
    sleep_score: scores.s,
    focus_score: scores.f,
    created_at: d.toISOString(),
  };
};

describe('EvolutionChart', () => {
  it('renders onboarding banner when no check-ins exist', () => {
    const { getByText } = render(<EvolutionChart checkins={[]} />);
    expect(getByText(/Faça seu primeiro check-in/)).toBeTruthy();
  });

  it('renders the section title (chart area) when check-ins exist', () => {
    const { getByText } = render(<EvolutionChart checkins={[makeCheckin(0)]} />);
    expect(getByText('Evolução diária')).toBeTruthy();
  });

  it('renders the section title when check-ins exist', () => {
    const { getByText } = render(<EvolutionChart checkins={[makeCheckin(0), makeCheckin(1)]} />);
    expect(getByText('Evolução diária')).toBeTruthy();
  });

  it('does not show the empty banner when check-ins are provided', () => {
    const { queryByText } = render(<EvolutionChart checkins={[makeCheckin(0)]} />);
    expect(queryByText(/Faça seu primeiro check-in/)).toBeNull();
  });

  it('limits chart to last 30 entries even with more data (no throw)', () => {
    const many = Array.from({ length: 35 }, (_, i) => makeCheckin(i));
    const { queryByText, getByText } = render(<EvolutionChart checkins={many} />);
    expect(queryByText(/Faça seu primeiro check-in/)).toBeNull();
    expect(getByText('Evolução diária')).toBeTruthy();
  });
});
