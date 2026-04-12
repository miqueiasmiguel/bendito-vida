import { create } from 'zustand';

import type { NutritionProfile } from '@/utils/match-profile';

interface QuizState {
  answers: Record<string, string[]>;
  nutritionProfile: NutritionProfile | null;
}

interface QuizActions {
  setAnswer: (questionId: string, optionId: string, multiSelect: boolean) => void;
  setProfile: (profile: NutritionProfile) => void;
  reset: () => void;
}

const NONE_OPTION_ID = 'q4-nenhuma';

const initialState: QuizState = {
  answers: {},
  nutritionProfile: null,
};

export const useQuizStore = create<QuizState & QuizActions>((set) => ({
  ...initialState,

  setAnswer: (questionId, optionId, multiSelect) =>
    set((state) => {
      if (!multiSelect) {
        return { answers: { ...state.answers, [questionId]: [optionId] } };
      }

      const current = state.answers[questionId] ?? [];

      // "Nenhuma" is mutually exclusive with all other options
      if (optionId === NONE_OPTION_ID) {
        return { answers: { ...state.answers, [questionId]: [NONE_OPTION_ID] } };
      }

      // Selecting another option removes "Nenhuma"
      const withoutNone = current.filter((id) => id !== NONE_OPTION_ID);

      if (withoutNone.includes(optionId)) {
        // Deselect if already selected
        const updated = withoutNone.filter((id) => id !== optionId);
        return { answers: { ...state.answers, [questionId]: updated } };
      }

      return { answers: { ...state.answers, [questionId]: [...withoutNone, optionId] } };
    }),

  setProfile: (profile) => set({ nutritionProfile: profile }),

  reset: () => set(initialState),
}));
