import { render } from '@testing-library/react-native';
import React from 'react';

import type { NudgeMessage } from '@/data/nutrition-engine';

import { NudgeAlert } from '../NudgeAlert';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

const mockNudge: NudgeMessage = {
  type: 'warning',
  message: 'Muito açúcar no mix!',
};

describe('NudgeAlert', () => {
  it('renders nothing when nudge is null', () => {
    const { toJSON } = render(<NudgeAlert nudge={null} onDismiss={() => {}} />);
    expect(toJSON()).toBeNull();
  });

  it('renders the nudge message when nudge is provided', () => {
    const { getByText } = render(<NudgeAlert nudge={mockNudge} onDismiss={() => {}} />);
    expect(getByText('Muito açúcar no mix!')).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(<NudgeAlert nudge={mockNudge} onDismiss={() => {}} />);
    expect(getByLabelText('Muito açúcar no mix!')).toBeTruthy();
  });
});
