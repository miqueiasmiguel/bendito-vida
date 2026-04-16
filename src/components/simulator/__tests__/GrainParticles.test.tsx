import { render } from '@testing-library/react-native';
import React from 'react';

import { GrainParticles } from '../GrainParticles';

describe('GrainParticles', () => {
  it('renders nothing when trigger is 0', () => {
    const { toJSON } = render(<GrainParticles color="#FF0000" trigger={0} />);
    expect(toJSON()).toBeNull();
  });

  it('renders particle container when trigger > 0', () => {
    const { getByLabelText } = render(<GrainParticles color="#FF0000" trigger={1} />);
    expect(getByLabelText('Animação de grãos caindo')).toBeTruthy();
  });

  it('renders particles when triggered', () => {
    const { getByLabelText } = render(<GrainParticles color="#00FF00" trigger={2} />);
    const container = getByLabelText('Animação de grãos caindo');
    // Container should have children (particles)
    expect(container.children.length).toBeGreaterThan(0);
  });
});
