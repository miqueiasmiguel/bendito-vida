import React from 'react';
import { Ellipse, G, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Gergelim: small oval sesame seeds scattered at different angles
export function GergelimIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G>
        <Ellipse
          cx="8.5"
          cy="9"
          rx="2"
          ry="3.5"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          transform="rotate(-20 8.5 9)"
        />
        <Ellipse
          cx="15.5"
          cy="8.5"
          rx="2"
          ry="3.5"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          transform="rotate(20 15.5 8.5)"
        />
        <Ellipse
          cx="12"
          cy="16"
          rx="2"
          ry="3.5"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          transform="rotate(5 12 16)"
        />
      </G>
    </Svg>
  );
}
