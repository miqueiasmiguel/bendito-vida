import React from 'react';
import { Circle, G, Line, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Sorgo: panicle — stem with spherical grains clustered at top
export function SorgoIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Main stem */}
      <Line
        x1="12"
        y1="22"
        x2="12"
        y2="12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Branches */}
      <G>
        <Line
          x1="12"
          y1="14"
          x2="8"
          y2="11"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Line
          x1="12"
          y1="13"
          x2="16"
          y2="10"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Line
          x1="12"
          y1="12"
          x2="10"
          y2="8"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Line
          x1="12"
          y1="12"
          x2="14"
          y2="8"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Line
          x1="12"
          y1="12"
          x2="12"
          y2="7"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </G>
      {/* Grain heads at branch tips */}
      <Circle cx="8" cy="10" r="1.5" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="16" cy="9" r="1.5" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="10" cy="7" r="1.5" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="14" cy="7" r="1.5" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="12" cy="5.5" r="1.5" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  );
}
