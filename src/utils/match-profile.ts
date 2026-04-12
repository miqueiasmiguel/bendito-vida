import { INGREDIENTS, type Ingredient } from '@/data/ingredients';
import { QUIZ_QUESTIONS, type NutrientTag } from '@/data/quiz-questions';

// Tiebreak order: earlier index = higher priority
const NUTRIENT_PRECEDENCE: NutrientTag[] = [
  'vitamina-c',
  'vitamina-b12',
  'vitamina-e',
  'omega3',
  'ferro',
  'calcio',
  'magnesio',
  'zinco',
  'selenio',
  'fibra',
  'proteina',
  'prebiotico',
  'cromo',
];

export interface NutritionProfile {
  topNutrients: NutrientTag[];
  suggestedIngredients: Ingredient[];
}

/**
 * Calculates a nutrition profile from quiz answers.
 * @param answers - Map of questionId → selected optionIds
 * @returns Profile with top 3 nutrients and suggested paraiban ingredients
 */
export function matchProfile(answers: Record<string, string[]>): NutritionProfile {
  const scores: Partial<Record<NutrientTag, number>> = {};

  // Accumulate scores from all selected options
  for (const question of QUIZ_QUESTIONS) {
    const selectedIds = answers[question.id] ?? [];
    for (const optionId of selectedIds) {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) continue;
      for (const tag of option.tags) {
        scores[tag] = (scores[tag] ?? 0) + 1;
      }
    }
  }

  // Sort nutrients by score desc, then by precedence for tiebreaks
  const ranked = (Object.keys(scores) as NutrientTag[]).sort((a, b) => {
    const scoreDiff = (scores[b] ?? 0) - (scores[a] ?? 0);
    if (scoreDiff !== 0) return scoreDiff;
    return NUTRIENT_PRECEDENCE.indexOf(a) - NUTRIENT_PRECEDENCE.indexOf(b);
  });

  const topNutrients = ranked.slice(0, 3);

  // Find ingredients that match any top nutrient (deduplicated, sorted by coverage)
  const seen = new Set<string>();
  const suggestedIngredients: Ingredient[] = [];

  for (const nutrient of topNutrients) {
    for (const ingredient of INGREDIENTS) {
      if (!seen.has(ingredient.id) && ingredient.nutrients.includes(nutrient)) {
        seen.add(ingredient.id);
        suggestedIngredients.push(ingredient);
      }
    }
  }

  return { topNutrients, suggestedIngredients };
}
