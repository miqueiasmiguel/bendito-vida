import { render } from '@testing-library/react-native';
import React from 'react';

import { GoogleIcon } from '../GoogleIcon';

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Svg: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) =>
      React.createElement(View, { testID: 'svg', ...props }, children),
    G: ({ children }: { children?: React.ReactNode }) => React.createElement(View, {}, children),
    Path: () => null,
  };
});

describe('GoogleIcon', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<GoogleIcon />);
    expect(getByTestId('svg')).toBeTruthy();
  });

  it('applies default size 20', () => {
    const { getByTestId } = render(<GoogleIcon />);
    const svg = getByTestId('svg');
    expect(svg.props.width).toBe(20);
    expect(svg.props.height).toBe(20);
  });

  it('applies custom size', () => {
    const { getByTestId } = render(<GoogleIcon size={32} />);
    const svg = getByTestId('svg');
    expect(svg.props.width).toBe(32);
    expect(svg.props.height).toBe(32);
  });
});
