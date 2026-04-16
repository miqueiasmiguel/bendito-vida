import React from 'react';
import { Path, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Castanha de Caju: iconic curved cashew/crescent shape
export function CastanhaCajuIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer cashew shape */}
      <Path
        d="M8 6 C5 8 4 12 5.5 16 C7 19.5 11 21.5 15 20 C18.5 18.5 19.5 15 18 12 C17 10 15.5 9 16 7 C15 5 12.5 5 11 6 C10 6.5 9 5.5 8 6 Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner curve suggesting the hollow side */}
      <Path
        d="M9.5 8 C8 10 7.5 13 9 16 C10 18 12.5 19.5 15 18.5"
        stroke={color}
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
