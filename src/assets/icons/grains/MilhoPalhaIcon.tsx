import React from 'react';
import { Circle, G, Path, Rect, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Milho de Palha: stylized corn cob with kernels and leaf
export function MilhoPalhaIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Cob body */}
      <Rect x="9" y="6" width="6" height="13" rx="3" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Kernel rows */}
      <G>
        <Circle cx="12" cy="9" r="1" fill={color} />
        <Circle cx="12" cy="12" r="1" fill={color} />
        <Circle cx="12" cy="15" r="1" fill={color} />
        <Circle cx="10.5" cy="10.5" r="0.75" fill={color} />
        <Circle cx="10.5" cy="13.5" r="0.75" fill={color} />
        <Circle cx="13.5" cy="10.5" r="0.75" fill={color} />
        <Circle cx="13.5" cy="13.5" r="0.75" fill={color} />
      </G>
      {/* Husk leaf */}
      <Path
        d="M9 8 C6 6 4 3 6 2 C8 1 9 4.5 9 6"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
