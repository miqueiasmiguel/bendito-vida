/**
 * GrainIcon — centralized grain icon renderer with fallback support.
 *
 * HOW TO ADD A NEW GRAIN:
 *  1. Create `src/assets/icons/grains/YourIngredientIcon.tsx` following the
 *     GrainIconBaseProps interface (size, color props; viewBox 0 0 24 24).
 *  2. Import the new component below.
 *  3. Add an entry to GRAIN_ICON_MAP with the ingredient's `id` as the key.
 *
 * If an ingredient has no registered icon the GenericGrainIcon is shown silently.
 */
import React from 'react';

import { AcerolaIcon } from '../../assets/icons/grains/AcerolaIcon';
import { AmendoimIcon } from '../../assets/icons/grains/AmendoimIcon';
import { CastanhaCajuIcon } from '../../assets/icons/grains/CastanhaCajuIcon';
import { ChiaIcon } from '../../assets/icons/grains/ChiaIcon';
import { FeijaoFradinhoIcon } from '../../assets/icons/grains/FeijaoFradinhoIcon';
import { FeijaoVerdeIcon } from '../../assets/icons/grains/FeijaoVerdeIcon';
import { GenericGrainIcon } from '../../assets/icons/grains/GenericGrainIcon';
import { GergelimIcon } from '../../assets/icons/grains/GergelimIcon';
import { GirassolIcon } from '../../assets/icons/grains/GirassolIcon';
import { LinhacaIcon } from '../../assets/icons/grains/LinhacaIcon';
import { MilhoPalhaIcon } from '../../assets/icons/grains/MilhoPalhaIcon';
import { QuinoaIcon } from '../../assets/icons/grains/QuinoaIcon';
import { SorgoIcon } from '../../assets/icons/grains/SorgoIcon';
import type { GrainIconBaseProps } from '../../assets/icons/grains/types';

type GrainIconComponent = React.FC<GrainIconBaseProps>;

const GRAIN_ICON_MAP: Record<string, GrainIconComponent> = {
  gergelim: GergelimIcon,
  'feijao-verde': FeijaoVerdeIcon,
  chia: ChiaIcon,
  amendoim: AmendoimIcon,
  girassol: GirassolIcon,
  linhaca: LinhacaIcon,
  'castanha-caju': CastanhaCajuIcon,
  'feijao-fradinho': FeijaoFradinhoIcon,
  sorgo: SorgoIcon,
  'milho-palha': MilhoPalhaIcon,
  quinoa: QuinoaIcon,
  acerola: AcerolaIcon,
};

export interface GrainIconProps {
  ingredientId: string;
  size?: number;
  color?: string;
}

export function GrainIcon({ ingredientId, size = 24, color = '#FFFFFF' }: GrainIconProps) {
  const IconComponent: GrainIconComponent = GRAIN_ICON_MAP[ingredientId] ?? GenericGrainIcon;
  return <IconComponent size={size} color={color} />;
}
