import { computeLayerRects } from '../MixJar';

describe('computeLayerRects', () => {
  it('returns empty array for empty fillStops', () => {
    const layers = computeLayerRects([], 0.5);
    expect(layers).toEqual([]);
  });

  it('returns empty array when total weight is 0', () => {
    const layers = computeLayerRects([{ color: '#FF0000', weight: 0 }], 0.5);
    expect(layers).toEqual([]);
  });

  it('returns empty array when fillLevel is 0', () => {
    const layers = computeLayerRects([{ color: '#FF0000', weight: 100 }], 0);
    expect(layers).toEqual([]);
  });

  it('returns a single layer for one ingredient', () => {
    const layers = computeLayerRects([{ color: '#FF0000', weight: 100 }], 0.5);
    expect(layers).toHaveLength(1);
    expect(layers[0].color).toBe('#FF0000');
    expect(layers[0].height).toBeGreaterThan(0);
    expect(layers[0].opacity).toBe(1.0);
  });

  it('returns proportional layers for two ingredients', () => {
    const layers = computeLayerRects(
      [
        { color: '#FF0000', weight: 30 },
        { color: '#0000FF', weight: 60 },
      ],
      1.0,
    );
    expect(layers).toHaveLength(2);
    // First ingredient (30/90 = 1/3 of total)
    expect(layers[0].color).toBe('#FF0000');
    // Second ingredient (60/90 = 2/3 of total)
    expect(layers[1].color).toBe('#0000FF');
    // Second layer should be roughly twice the height of first
    expect(layers[1].height / layers[0].height).toBeCloseTo(2, 1);
  });

  it('stacks layers from bottom to top (first ingredient at bottom)', () => {
    const layers = computeLayerRects(
      [
        { color: '#FF0000', weight: 50 },
        { color: '#00FF00', weight: 50 },
      ],
      1.0,
    );
    // Bottom layer has higher y value (lower on screen)
    expect(layers[0].y).toBeGreaterThan(layers[1].y);
  });

  it('produces N layers for N ingredients', () => {
    const layers = computeLayerRects(
      [
        { color: '#FF0000', weight: 30 },
        { color: '#00FF00', weight: 30 },
        { color: '#0000FF', weight: 30 },
      ],
      0.8,
    );
    expect(layers).toHaveLength(3);
  });

  it('alternates opacity for visual texture', () => {
    const layers = computeLayerRects(
      [
        { color: '#FF0000', weight: 30 },
        { color: '#00FF00', weight: 30 },
        { color: '#0000FF', weight: 30 },
      ],
      1.0,
    );
    expect(layers[0].opacity).toBe(1.0);
    expect(layers[1].opacity).toBe(0.88);
    expect(layers[2].opacity).toBe(1.0);
  });
});
