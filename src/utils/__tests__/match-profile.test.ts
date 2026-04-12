import { matchProfile } from '../match-profile';

describe('matchProfile', () => {
  it('returns empty top nutrients when no answers provided', () => {
    const result = matchProfile({});
    expect(result.topNutrients).toHaveLength(0);
    expect(result.suggestedIngredients).toHaveLength(0);
  });

  it('returns top 3 nutrients from single-select answers', () => {
    // q1: foco mental → omega3, magnesio, vitamina-b12
    const result = matchProfile({ q1: ['q1-foco'] });
    expect(result.topNutrients).toHaveLength(3);
    expect(result.topNutrients).toContain('omega3');
    expect(result.topNutrients).toContain('magnesio');
    expect(result.topNutrients).toContain('vitamina-b12');
  });

  it('accumulates scores from multiple questions', () => {
    // q1: foco → omega3(1), magnesio(1), vitamina-b12(1)
    // q2: cansado → ferro(1), vitamina-b12(1), magnesio(1)
    // vitamina-b12 and magnesio should have score 2, others 1
    const result = matchProfile({
      q1: ['q1-foco'],
      q2: ['q2-cansado'],
    });
    const top = result.topNutrients;
    expect(top[0] === 'vitamina-b12' || top[1] === 'vitamina-b12').toBe(true);
    expect(top[0] === 'magnesio' || top[1] === 'magnesio').toBe(true);
  });

  it('handles multi-select answers (question 4)', () => {
    const result = matchProfile({ q4: ['q4-gluten', 'q4-lactose'] });
    // Both options have empty tags, so no nutrients accumulated
    expect(result.topNutrients).toHaveLength(0);
  });

  it('"Nenhuma" option tags are included when selected alone', () => {
    // q4-nenhuma → omega3, proteina
    const result = matchProfile({ q4: ['q4-nenhuma'] });
    expect(result.topNutrients).toContain('omega3');
    expect(result.topNutrients).toContain('proteina');
  });

  it('returns at most 3 top nutrients', () => {
    const result = matchProfile({
      q1: ['q1-energia'],
      q2: ['q2-cansado'],
      q3: ['q3-raramente'],
      q4: ['q4-nenhuma'],
      q5: ['q5-medico'],
    });
    expect(result.topNutrients.length).toBeLessThanOrEqual(3);
  });

  it('resolves tiebreaks by nutrient precedence (vitamins before minerals)', () => {
    // q1-imunidade → vitamina-c(1), zinco(1), selenio(1)
    // All score 1, tiebreak: vitamina-c (idx 0) < zinco (idx 7) < selenio (idx 8)
    const result = matchProfile({ q1: ['q1-imunidade'] });
    expect(result.topNutrients[0]).toBe('vitamina-c');
    expect(result.topNutrients[1]).toBe('zinco');
    expect(result.topNutrients[2]).toBe('selenio');
  });

  it('suggests ingredients matching the top nutrients', () => {
    // omega3 ingredients include: gergelim, chia, linhaca
    const result = matchProfile({ q1: ['q1-foco'] }); // → omega3, magnesio, vitamina-b12
    expect(result.suggestedIngredients.length).toBeGreaterThan(0);
    const ingredientNames = result.suggestedIngredients.map((i) => i.id);
    // omega3 ingredients
    const omega3Ids = ['gergelim', 'chia', 'linhaca'];
    const hasOmega3 = omega3Ids.some((id) => ingredientNames.includes(id));
    expect(hasOmega3).toBe(true);
  });

  it('does not duplicate ingredients in suggestions', () => {
    const result = matchProfile({
      q1: ['q1-foco'],
      q3: ['q3-raramente'],
    });
    const ids = result.suggestedIngredients.map((i) => i.id);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });
});
