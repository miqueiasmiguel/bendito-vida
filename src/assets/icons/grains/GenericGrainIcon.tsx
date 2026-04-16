import React from 'react';
import { Ellipse, Line, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

export function GenericGrainIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="12" cy="12" rx="5" ry="7.5" stroke={color} strokeWidth="1.5" fill="none" />
      <Line
        x1="12"
        y1="4.5"
        x2="12"
        y2="19.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Line x1="9" y1="10" x2="15" y2="10" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <Line
        x1="8.5"
        y1="13"
        x2="15.5"
        y2="13"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );
}
