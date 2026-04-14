import { render } from '@testing-library/react-native';
import React from 'react';

import type { RadarDataPoint } from '../BioactiveRadarChart';
import { BioactiveRadarChart } from '../BioactiveRadarChart';

// Mock react-native-svg so SVG Text renders as native Text (findable by getByText)
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Svg: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, { testID: 'svg-root' }, children),
    Polygon: () => null,
    Circle: () => null,
    Line: () => null,
    Text: ({ children }: { children: React.ReactNode }) =>
      React.createElement(Text, null, children),
  };
});

function make3(): RadarDataPoint[] {
  return [
    { label: 'Ômega-3', value: 3, maxValue: 5 },
    { label: 'Fibras', value: 2, maxValue: 5 },
    { label: 'Cálcio', value: 1, maxValue: 5 },
  ];
}

function make6(): RadarDataPoint[] {
  return [
    { label: 'Ômega-3', value: 5, maxValue: 5 },
    { label: 'Fibras', value: 4, maxValue: 5 },
    { label: 'Cálcio', value: 3, maxValue: 5 },
    { label: 'Ferro', value: 3, maxValue: 5 },
    { label: 'Zinco', value: 2, maxValue: 5 },
    { label: 'Cromo', value: 1, maxValue: 5 },
  ];
}

describe('BioactiveRadarChart', () => {
  it('renders with 3 nutrients (minimum)', () => {
    const { getByText } = render(<BioactiveRadarChart data={make3()} />);
    expect(getByText('Ômega-3')).toBeTruthy();
    expect(getByText('Fibras')).toBeTruthy();
    expect(getByText('Cálcio')).toBeTruthy();
  });

  it('renders with 6 nutrients (maximum)', () => {
    const { getByText } = render(<BioactiveRadarChart data={make6()} />);
    expect(getByText('Ômega-3')).toBeTruthy();
    expect(getByText('Zinco')).toBeTruthy();
    expect(getByText('Cromo')).toBeTruthy();
  });

  it('truncates labels longer than 8 characters', () => {
    const data: RadarDataPoint[] = [
      { label: 'Vitaminas Extra', value: 3, maxValue: 5 },
      { label: 'Fibras', value: 2, maxValue: 5 },
      { label: 'Cálcio', value: 1, maxValue: 5 },
    ];
    const { getByText, queryByText } = render(<BioactiveRadarChart data={data} />);
    // 'Vitaminas Extra' truncated to first 8 chars = 'Vitamina'
    expect(getByText('Vitamina')).toBeTruthy();
    expect(queryByText('Vitaminas Extra')).toBeNull();
  });

  it('renders with custom accessibilityLabel', () => {
    const { UNSAFE_getByProps } = render(
      <BioactiveRadarChart data={make3()} accessibilityLabel="Radar de nutrientes" />,
    );
    expect(UNSAFE_getByProps({ accessibilityLabel: 'Radar de nutrientes' })).toBeTruthy();
  });
});
