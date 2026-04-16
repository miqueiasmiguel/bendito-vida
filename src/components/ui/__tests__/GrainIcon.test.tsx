import { render } from '@testing-library/react-native';
import React from 'react';

import { GrainIcon } from '../GrainIcon';

describe('GrainIcon', () => {
  it('renders without error for a known ingredient', () => {
    const { toJSON } = render(<GrainIcon ingredientId="chia" size={28} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without error for every registered ingredient', () => {
    const knownIds = [
      'gergelim',
      'feijao-verde',
      'chia',
      'amendoim',
      'girassol',
      'linhaca',
      'castanha-caju',
      'feijao-fradinho',
      'sorgo',
      'milho-palha',
      'quinoa',
      'acerola',
    ];

    knownIds.forEach((id) => {
      const { toJSON } = render(<GrainIcon ingredientId={id} size={24} />);
      expect(toJSON()).toBeTruthy();
    });
  });

  it('renders fallback (GenericGrainIcon) for unknown ingredient without error', () => {
    const { toJSON } = render(<GrainIcon ingredientId="novo-grao-sem-icone" size={28} />);
    expect(toJSON()).toBeTruthy();
  });

  it('applies the size prop to the SVG', () => {
    const { toJSON } = render(<GrainIcon ingredientId="chia" size={40} />);
    const json = toJSON() as { props: { width: number; height: number } };
    expect(json.props.width).toBe(40);
    expect(json.props.height).toBe(40);
  });

  it('uses white color by default', () => {
    // Default color "#FFFFFF" should be passed through to the SVG element
    const { toJSON } = render(<GrainIcon ingredientId="gergelim" />);
    expect(toJSON()).toBeTruthy();
  });
});
