import { render } from '@testing-library/react-native';
import React from 'react';

import { HintRow } from '../hint-row';

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  }),
}));

describe('HintRow', () => {
  it('renders default title and hint', () => {
    const { getByText } = render(<HintRow />);
    expect(getByText('Try editing')).toBeTruthy();
    expect(getByText('app/index.tsx')).toBeTruthy();
  });

  it('renders custom title', () => {
    const { getByText } = render(<HintRow title="Customize me" />);
    expect(getByText('Customize me')).toBeTruthy();
  });

  it('renders custom hint text', () => {
    const { getByText } = render(<HintRow hint="src/components/" />);
    expect(getByText('src/components/')).toBeTruthy();
  });

  it('renders ReactNode hint', () => {
    const { getByText } = render(<HintRow hint={<React.Fragment>some/path.tsx</React.Fragment>} />);
    expect(getByText('some/path.tsx')).toBeTruthy();
  });
});
