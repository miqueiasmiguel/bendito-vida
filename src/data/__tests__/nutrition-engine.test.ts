import type { Ingredient } from '../ingredients';
import {
  calculateNutrition,
  calculateNutritionFromMix,
  generateNudges,
  MAX_CALORIES,
} from '../nutrition-engine';

const makeIngredient = (overrides: Partial<Ingredient> = {}): Ingredient => ({
  id: 'test',
  name: 'Test',
  description: '',
  origin: '',
  nutrients: [],
  isParaibano: false,
  color: '#000',
  nutrition: { calories: 100, fiber: 2, protein: 3, omega3: 0.5 },
  ...overrides,
});

describe('calculateNutritionFromMix', () => {
  it('returns zeros for empty mix', () => {
    const result = calculateNutritionFromMix({});
    expect(result).toEqual({ calories: 0, fiber: 0, protein: 0, omega3: 0 });
  });

  it('calculates nutrition proportionally to grams', () => {
    const ing = makeIngredient({ nutrition: { calories: 200, fiber: 4, protein: 6, omega3: 1 } });
    const result = calculateNutritionFromMix({ a: { ingredient: ing, grams: 50 } });
    expect(result.calories).toBeCloseTo(100);
    expect(result.fiber).toBeCloseTo(2);
    expect(result.protein).toBeCloseTo(3);
    expect(result.omega3).toBeCloseTo(0.5);
  });

  it('sums multiple ingredients', () => {
    const a = makeIngredient({
      id: 'a',
      nutrition: { calories: 100, fiber: 2, protein: 3, omega3: 0 },
    });
    const b = makeIngredient({
      id: 'b',
      nutrition: { calories: 200, fiber: 4, protein: 6, omega3: 1 },
    });
    const result = calculateNutritionFromMix({
      a: { ingredient: a, grams: 100 },
      b: { ingredient: b, grams: 100 },
    });
    expect(result.calories).toBeCloseTo(300);
    expect(result.fiber).toBeCloseTo(6);
    expect(result.protein).toBeCloseTo(9);
    expect(result.omega3).toBeCloseTo(1);
  });
});

describe('calculateNutrition', () => {
  it('returns zeros for empty list', () => {
    expect(calculateNutrition([])).toEqual({ calories: 0, fiber: 0, protein: 0, omega3: 0 });
  });

  it('sums raw nutrition values (no grams scaling)', () => {
    const a = makeIngredient({ nutrition: { calories: 50, fiber: 1, protein: 2, omega3: 0.1 } });
    const b = makeIngredient({ nutrition: { calories: 80, fiber: 3, protein: 4, omega3: 0.2 } });
    const result = calculateNutrition([a, b]);
    expect(result.calories).toBeCloseTo(130);
    expect(result.fiber).toBeCloseTo(4);
    expect(result.protein).toBeCloseTo(6);
    expect(result.omega3).toBeCloseTo(0.3);
  });

  it('handles single ingredient', () => {
    const ing = makeIngredient({
      nutrition: { calories: 146, fiber: 10.3, protein: 4.9, omega3: 5.4 },
    });
    const result = calculateNutrition([ing]);
    expect(result.calories).toBeCloseTo(146);
    expect(result.fiber).toBeCloseTo(10.3);
    expect(result.omega3).toBeCloseTo(5.4);
  });
});

describe('generateNudges', () => {
  const baseNutrition = { calories: 200, fiber: 8, protein: 5, omega3: 3 };

  it('returns empty array when no thresholds exceeded', () => {
    const nudges = generateNudges(baseNutrition, [], []);
    expect(nudges).toHaveLength(0);
  });

  it('warns when calories exceed CALORIE_WARN (500)', () => {
    const nudges = generateNudges({ ...baseNutrition, calories: 510 }, [], []);
    const warning = nudges.find((n) => n.type === 'warning');
    expect(warning).toBeDefined();
    expect(warning?.message).toMatch(/calórico/);
  });

  it('does not warn when calories are exactly at CALORIE_WARN', () => {
    const nudges = generateNudges({ ...baseNutrition, calories: 500 }, [], []);
    expect(nudges.find((n) => n.type === 'warning')).toBeUndefined();
  });

  it('suggests fiber boost when fiber low and >=2 ingredients selected', () => {
    const twoIngredients = [makeIngredient(), makeIngredient()];
    const nudges = generateNudges({ ...baseNutrition, fiber: 4 }, twoIngredients, []);
    const suggestion = nudges.find((n) => n.message.includes('chia'));
    expect(suggestion?.type).toBe('suggestion');
  });

  it('does not suggest fiber when <2 ingredients selected', () => {
    const nudges = generateNudges({ ...baseNutrition, fiber: 4 }, [makeIngredient()], []);
    expect(nudges.find((n) => n.message.includes('chia'))).toBeUndefined();
  });

  it('suggests omega-3 when user has foco tag and omega3 is low', () => {
    const nudges = generateNudges({ ...baseNutrition, omega3: 1 }, [], ['foco']);
    const suggestion = nudges.find((n) => n.message.includes('ômega-3'));
    expect(suggestion?.type).toBe('suggestion');
  });

  it('does not suggest omega-3 for foco tag when omega3 is sufficient', () => {
    const nudges = generateNudges({ ...baseNutrition, omega3: 3 }, [], ['foco']);
    expect(nudges.find((n) => n.message.includes('ômega-3'))).toBeUndefined();
  });

  it('shows paraibano info nudge for last added paraibano ingredient', () => {
    const paraibano = makeIngredient({ name: 'Feijão Verde', isParaibano: true });
    const nudges = generateNudges(baseNutrition, [paraibano], []);
    const info = nudges.find((n) => n.type === 'info');
    expect(info?.message).toContain('Feijão Verde');
    expect(info?.message).toContain('paraibana');
  });

  it('does not show paraibano nudge for non-paraibano last ingredient', () => {
    const nonParaibano = makeIngredient({ isParaibano: false });
    const nudges = generateNudges(baseNutrition, [nonParaibano], []);
    expect(nudges.find((n) => n.type === 'info')).toBeUndefined();
  });

  it('can return multiple nudges simultaneously', () => {
    const paraibano = makeIngredient({ isParaibano: true });
    const nudges = generateNudges(
      { calories: 510, fiber: 4, protein: 5, omega3: 1 },
      [makeIngredient(), paraibano],
      ['foco'],
    );
    expect(nudges.length).toBeGreaterThanOrEqual(3);
  });

  it('exports MAX_CALORIES constant', () => {
    expect(MAX_CALORIES).toBe(600);
  });
});
