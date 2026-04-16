import React from 'react';
import { Line, Path, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Amendoim: peanut shell with two lobes and central groove
export function AmendoimIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Peanut shell outline — two-lobe shape */}
      <Path
        d="M12 3 C15.5 3 17.5 6 17.5 8.5 C17.5 11 15.5 12 13 12 C10.5 12 8.5 13 8.5 15.5 C8.5 18 10.5 21 12 21 C13.5 21 15.5 18 15.5 15.5 C15.5 13 13.5 12 11 12 C8.5 12 6.5 11 6.5 8.5 C6.5 6 8.5 3 12 3 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Central groove */}
      <Line
        x1="12"
        y1="3"
        x2="12"
        y2="21"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="2 2"
      />
    </Svg>
  );
}
