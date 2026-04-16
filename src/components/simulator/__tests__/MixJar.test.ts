import { colors } from '@/theme';

import { computeGradientStops } from '../MixJar';

describe('computeGradientStops', () => {
  it('returns neutral-200 stops for empty fillStops', () => {
    const stops = computeGradientStops([]);
    expect(stops).toEqual([
      { offset: '0', color: colors.neutral[200] },
      { offset: '1', color: colors.neutral[200] },
    ]);
  });

  it('returns neutral-200 stops when total weight is 0', () => {
    const stops = computeGradientStops([{ color: '#FF0000', weight: 0 }]);
    expect(stops).toEqual([
      { offset: '0', color: colors.neutral[200] },
      { offset: '1', color: colors.neutral[200] },
    ]);
  });

  it('spans the full gradient (0 to 1) for a single ingredient', () => {
    const stops = computeGradientStops([{ color: '#FF0000', weight: 100 }]);
    expect(stops).toEqual([
      { offset: '0', color: '#FF0000' },
      { offset: '1', color: '#FF0000' },
    ]);
  });

  it('splits gradient proportionally for two ingredients', () => {
    const stops = computeGradientStops([
      { color: '#FF0000', weight: 30 },
      { color: '#0000FF', weight: 60 },
    ]);
    // A covers 0 to 30/90 ≈ 0.333; B covers 0.333 to 1
    expect(stops[0]).toEqual({ offset: '0', color: '#FF0000' });
    expect(stops[1].color).toBe('#FF0000');
    expect(parseFloat(stops[1].offset)).toBeCloseTo(1 / 3, 2);
    expect(stops[2].color).toBe('#0000FF');
    expect(parseFloat(stops[2].offset)).toBeCloseTo(1 / 3, 2);
    expect(stops[3]).toEqual({ offset: '1', color: '#0000FF' });
  });

  it('produces 2*N stops for N ingredients', () => {
    const stops = computeGradientStops([
      { color: '#FF0000', weight: 30 },
      { color: '#00FF00', weight: 30 },
      { color: '#0000FF', weight: 30 },
    ]);
    expect(stops).toHaveLength(6);
    // First segment starts at 0
    expect(stops[0].offset).toBe('0');
    // Last segment ends at 1
    expect(stops[5].offset).toBe('1');
  });
});
