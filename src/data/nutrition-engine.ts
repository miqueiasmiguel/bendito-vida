import type { Ingredient } from './ingredients';

export interface NutritionSummary {
  calories: number;
  fiber: number;
  protein: number;
  omega3: number;
}

export interface NudgeMessage {
  type: 'warning' | 'suggestion' | 'info';
  message: string;
}

export const MAX_CALORIES = 600;
const CALORIE_WARN = 500;
const FIBER_LOW = 5;
const OMEGA3_LOW_FOCUS = 2;

export function calculateNutritionFromMix(
  mixItems: Record<string, { ingredient: Ingredient; grams: number }>,
): NutritionSummary {
  return Object.values(mixItems).reduce(
    (acc, { ingredient, grams }) => ({
      calories: acc.calories + (ingredient.nutrition.calories * grams) / 100,
      fiber: acc.fiber + (ingredient.nutrition.fiber * grams) / 100,
      protein: acc.protein + (ingredient.nutrition.protein * grams) / 100,
      omega3: acc.omega3 + (ingredient.nutrition.omega3 * grams) / 100,
    }),
    { calories: 0, fiber: 0, protein: 0, omega3: 0 },
  );
}

export function calculateNutrition(selected: Ingredient[]): NutritionSummary {
  return selected.reduce(
    (acc, ing) => ({
      calories: acc.calories + ing.nutrition.calories,
      fiber: acc.fiber + ing.nutrition.fiber,
      protein: acc.protein + ing.nutrition.protein,
      omega3: acc.omega3 + ing.nutrition.omega3,
    }),
    { calories: 0, fiber: 0, protein: 0, omega3: 0 },
  );
}

export function generateNudges(
  nutrition: NutritionSummary,
  selected: Ingredient[],
  userTags: string[],
): NudgeMessage[] {
  const nudges: NudgeMessage[] = [];

  if (nutrition.calories > CALORIE_WARN) {
    nudges.push({
      type: 'warning',
      message: 'Seu mix está bem calórico. Considere reduzir um ingrediente.',
    });
  }

  if (nutrition.fiber < FIBER_LOW && selected.length >= 2) {
    nudges.push({
      type: 'suggestion',
      message: 'Adicione chia ou linhaça para turbinar as fibras!',
    });
  }

  if (userTags.includes('foco') && nutrition.omega3 < OMEGA3_LOW_FOCUS) {
    nudges.push({
      type: 'suggestion',
      message: 'Para melhorar o foco, adicione sementes ricas em ômega-3.',
    });
  }

  const lastAdded = selected[selected.length - 1];
  if (lastAdded?.isParaibano) {
    nudges.push({
      type: 'info',
      message: `${lastAdded.name} — da biodiversidade paraibana!`,
    });
  }

  return nudges;
}
