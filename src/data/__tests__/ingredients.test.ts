import { INGREDIENTS, type Ingredient } from '../ingredients';

describe('INGREDIENTS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(INGREDIENTS)).toBe(true);
    expect(INGREDIENTS.length).toBeGreaterThan(0);
  });

  it('every ingredient has required string fields', () => {
    for (const ing of INGREDIENTS) {
      expect(typeof ing.id).toBe('string');
      expect(ing.id.length).toBeGreaterThan(0);
      expect(typeof ing.name).toBe('string');
      expect(ing.name.length).toBeGreaterThan(0);
      expect(typeof ing.description).toBe('string');
      expect(typeof ing.origin).toBe('string');
      expect(typeof ing.color).toBe('string');
    }
  });

  it('every ingredient has valid nutrition values (non-negative numbers)', () => {
    for (const ing of INGREDIENTS) {
      expect(typeof ing.nutrition.calories).toBe('number');
      expect(typeof ing.nutrition.fiber).toBe('number');
      expect(typeof ing.nutrition.protein).toBe('number');
      expect(typeof ing.nutrition.omega3).toBe('number');
      expect(ing.nutrition.calories).toBeGreaterThanOrEqual(0);
      expect(ing.nutrition.fiber).toBeGreaterThanOrEqual(0);
      expect(ing.nutrition.protein).toBeGreaterThanOrEqual(0);
      expect(ing.nutrition.omega3).toBeGreaterThanOrEqual(0);
    }
  });

  it('every ingredient has an array of nutrients', () => {
    for (const ing of INGREDIENTS) {
      expect(Array.isArray(ing.nutrients)).toBe(true);
    }
  });

  it('every ingredient has a boolean isParaibano field', () => {
    for (const ing of INGREDIENTS) {
      expect(typeof ing.isParaibano).toBe('boolean');
    }
  });

  it('ingredient ids are unique', () => {
    const ids = INGREDIENTS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('at least one ingredient is paraibano', () => {
    expect(INGREDIENTS.some((i) => i.isParaibano)).toBe(true);
  });

  it('includes expected paraibano ingredients', () => {
    const paraibanos = INGREDIENTS.filter((i) => i.isParaibano).map((i) => i.id);
    expect(paraibanos).toContain('gergelim');
    expect(paraibanos).toContain('feijao-verde');
    expect(paraibanos).toContain('amendoim');
  });

  it('chia has high omega3', () => {
    const chia = INGREDIENTS.find((i) => i.id === 'chia');
    expect(chia).toBeDefined();
    expect((chia as Ingredient).nutrition.omega3).toBeGreaterThan(4);
  });

  it('linhaca has high omega3', () => {
    const linhaca = INGREDIENTS.find((i) => i.id === 'linhaca');
    expect(linhaca).toBeDefined();
    expect((linhaca as Ingredient).nutrition.omega3).toBeGreaterThan(4);
  });
});
