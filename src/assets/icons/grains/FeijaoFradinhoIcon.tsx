import React from 'react';
import { Circle, Ellipse, Svg } from 'react-native-svg';

import type { GrainIconBaseProps } from './types';

// Feijão Fradinho (black-eyed pea): oval bean with characteristic "eye" spot
export function FeijaoFradinhoIcon({ size = 24, color = '#FFFFFF' }: GrainIconBaseProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Bean body */}
      <Ellipse cx="12" cy="12" rx="7" ry="5.5" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Characteristic "eye" (hilum) — the dark spot */}
      <Ellipse cx="9" cy="12" rx="2" ry="1.5" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="9" cy="12" r="0.7" fill={color} />
    </Svg>
  );
}
