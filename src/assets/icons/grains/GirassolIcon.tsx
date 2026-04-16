import React from 'react';
import { Circle, G, Path, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Girassol: stylized sunflower with petals and center
export function GirassolIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G>
        {/* Petals */}
        <Path
          d="M12 2 L13 6 L11 6 Z M12 22 L13 18 L11 18 Z M2 12 L6 13 L6 11 Z M22 12 L18 13 L18 11 Z"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4.9 4.9 L7 8 L5 8 Z M19.1 19.1 L17 16 L19 16 Z M4.9 19.1 L8 17 L8 19 Z M19.1 4.9 L16 7 L16 5 Z"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Center circle */}
        <Circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth="1.5" fill="none" />
        {/* Center dots */}
        <Circle cx="12" cy="12" r="1" fill={color} />
      </G>
    </Svg>
  );
}
