/** Supabase database types — mirrors 0001_initial_schema.sql */

export interface Profile {
  id: string;
  name: string | null;
  onboarding_completed: boolean;
  /** Calculated bioactive profile saved after quiz (JSON object) */
  bioactive_profile: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface NutritionSummary {
  calories: number;
  fiber: number;
  protein: number;
  omega3: number;
}

export interface Mix {
  id: string;
  user_id: string;
  name: string;
  /** Array of ingredient entries with ID and grams, referencing src/data/ingredients.ts */
  ingredients: { id: string; grams: number }[];
  nutrition: NutritionSummary;
  created_at: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  /** ISO date string, e.g. "2026-04-15" */
  date: string;
  energy_score: number;
  sleep_score: number;
  focus_score: number;
  created_at: string;
}
