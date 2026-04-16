import React from 'react';
import { Circle, Ellipse, G, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Chia: dense cluster of small rounded seeds
export function ChiaIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G>
        <Ellipse cx="9" cy="8" rx="2" ry="2.5" stroke={color} strokeWidth="1.5" fill="none" />
        <Ellipse cx="15" cy="9" rx="2" ry="2.5" stroke={color} strokeWidth="1.5" fill="none" />
        <Ellipse cx="12" cy="13" rx="2" ry="2.5" stroke={color} strokeWidth="1.5" fill="none" />
        <Ellipse cx="7.5" cy="14" rx="2" ry="2.5" stroke={color} strokeWidth="1.5" fill="none" />
        <Ellipse cx="16.5" cy="15" rx="2" ry="2.5" stroke={color} strokeWidth="1.5" fill="none" />
        {/* Center dot on each seed */}
        <Circle cx="9" cy="8" r="0.6" fill={color} />
        <Circle cx="15" cy="9" r="0.6" fill={color} />
        <Circle cx="12" cy="13" r="0.6" fill={color} />
        <Circle cx="7.5" cy="14" r="0.6" fill={color} />
        <Circle cx="16.5" cy="15" r="0.6" fill={color} />
      </G>
    </Svg>
  );
}
