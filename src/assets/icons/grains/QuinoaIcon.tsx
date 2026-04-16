import React from 'react';
import { Circle, G, Line, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Quinoa: dense panicle with many small circles in a bushy cluster
export function QuinoaIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Main stem */}
      <Line
        x1="12"
        y1="22"
        x2="12"
        y2="14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Dense branches */}
      <G>
        <Line x1="12" y1="16" x2="7" y2="13" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <Line
          x1="12"
          y1="15"
          x2="17"
          y2="12"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
        />
        <Line x1="12" y1="14" x2="9" y2="10" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <Line
          x1="12"
          y1="14"
          x2="15"
          y2="10"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
        />
        <Line x1="12" y1="14" x2="12" y2="9" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <Line x1="12" y1="14" x2="6" y2="10" stroke={color} strokeWidth="1" strokeLinecap="round" />
        <Line
          x1="12"
          y1="14"
          x2="18"
          y2="10"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
        />
      </G>
      {/* Dense grain dots at tips */}
      <Circle cx="7" cy="12" r="1.2" fill={color} />
      <Circle cx="17" cy="11" r="1.2" fill={color} />
      <Circle cx="9" cy="9" r="1.2" fill={color} />
      <Circle cx="15" cy="9" r="1.2" fill={color} />
      <Circle cx="12" cy="8" r="1.2" fill={color} />
      <Circle cx="6" cy="9" r="1.2" fill={color} />
      <Circle cx="18" cy="9" r="1.2" fill={color} />
    </Svg>
  );
}
