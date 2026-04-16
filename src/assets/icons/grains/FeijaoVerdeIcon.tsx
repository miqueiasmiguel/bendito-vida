import React from 'react';
import { Circle, Path, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Feijão Verde: kidney bean shape with inner curve
export function FeijaoVerdeIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer kidney bean shape */}
      <Path
        d="M7 12 C7 7 10 5 13.5 6 C17 7 18 10 17 14 C16 17 13 19.5 9.5 18 C6.5 16.5 7 12 7 12 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner concave curve */}
      <Path
        d="M9 12 C9 9.5 10.5 8 12.5 8.5"
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
      {/* Small seed dots */}
      <Circle cx="13" cy="12" r="1" fill={color} />
      <Circle cx="11.5" cy="14.5" r="1" fill={color} />
    </Svg>
  );
}
