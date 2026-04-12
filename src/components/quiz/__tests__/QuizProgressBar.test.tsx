import { render } from '@testing-library/react-native';
import React from 'react';

import { QuizProgressBar } from '../QuizProgressBar';

describe('QuizProgressBar', () => {
  it('renders the step label "1 de 5"', () => {
    const { getByText } = render(<QuizProgressBar current={1} total={5} />);
    expect(getByText('1 de 5')).toBeTruthy();
  });

  it('renders the step label "3 de 5"', () => {
    const { getByText } = render(<QuizProgressBar current={3} total={5} />);
    expect(getByText('3 de 5')).toBeTruthy();
  });

  it('renders the step label "5 de 5" on last question', () => {
    const { getByText } = render(<QuizProgressBar current={5} total={5} />);
    expect(getByText('5 de 5')).toBeTruthy();
  });

  it('exposes accessibilityRole progressbar', () => {
    const { getByLabelText } = render(<QuizProgressBar current={2} total={5} />);
    const bar = getByLabelText('Pergunta 2 de 5');
    expect(bar.props.accessibilityRole).toBe('progressbar');
  });

  it('exposes correct accessibilityValue', () => {
    const { getByLabelText } = render(<QuizProgressBar current={2} total={5} />);
    const bar = getByLabelText('Pergunta 2 de 5');
    expect(bar.props.accessibilityValue).toEqual({ now: 2, min: 1, max: 5 });
  });
});
