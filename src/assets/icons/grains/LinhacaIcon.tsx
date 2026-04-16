import React from 'react';
import { Ellipse, Line, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Linhaça: elongated oval flaxseed with central vein and lateral veins
export function LinhacaIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Ellipse cx="12" cy="12" rx="3.5" ry="8" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Central vein */}
      <Line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Lateral veins */}
      <Line
        x1="12"
        y1="9"
        x2="9.5"
        y2="10.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <Line
        x1="12"
        y1="9"
        x2="14.5"
        y2="10.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <Line
        x1="12"
        y1="14"
        x2="9.5"
        y2="12.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <Line
        x1="12"
        y1="14"
        x2="14.5"
        y2="12.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );
}
