import React from 'react';
import { Circle, G, Line, Path, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Acerola: round fruit with 5-lobe calyx and drupe segment lines
export function AcerolaIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Fruit body */}
      <Circle cx="12" cy="14" r="6.5" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Drupe segments — 3 lines dividing the fruit */}
      <Line
        x1="12"
        y1="7.5"
        x2="12"
        y2="20.5"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <Line
        x1="5.5"
        y1="14"
        x2="18.5"
        y2="14"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Calyx (5 small leaves at top) */}
      <G>
        <Path
          d="M12 7.5 C12 7.5 11 5 12 4 C13 5 12 7.5 12 7.5"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M12 7.5 C12 7.5 9.5 5.5 9 4 C10.5 4 12 7.5 12 7.5"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M12 7.5 C12 7.5 14.5 5.5 15 4 C13.5 4 12 7.5 12 7.5"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}
