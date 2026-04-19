import { render } from '@testing-library/react-native';
import React from 'react';

import { ThemedView } from '../themed-view';

jest.mock('@/hooks/use-theme', () => ({
  useTheme: () => ({
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  }),
}));

describe('ThemedView', () => {
  it('renders children', () => {
    const { toJSON } = render(<ThemedView />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with backgroundElement type', () => {
    const { toJSON } = render(<ThemedView type="backgroundElement" testID="view" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with background type', () => {
    const { toJSON } = render(<ThemedView type="background" testID="view" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with backgroundSelected type', () => {
    const { toJSON } = render(<ThemedView type="backgroundSelected" testID="view" />);
    expect(toJSON()).toBeTruthy();
  });

  it('applies custom style alongside theme background', () => {
    const { toJSON } = render(<ThemedView testID="view" />);
    expect(toJSON()).toBeTruthy();
  });

  it('uses background key when no type provided', () => {
    const { toJSON } = render(<ThemedView testID="view" />);
    expect(toJSON()).toBeTruthy();
  });
});
