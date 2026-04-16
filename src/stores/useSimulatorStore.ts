import { create } from 'zustand';

import type { Ingredient } from '@/data/ingredients';

export interface MixItem {
  ingredient: Ingredient;
  grams: number;
}

interface SimulatorState {
  mixItems: Record<string, MixItem>;
}

interface SimulatorActions {
  addGrams: (ingredient: Ingredient, amount: number) => void;
  removeIngredient: (id: string) => void;
  clearMix: () => void;
  resetMix: () => void;
}

const initialState: SimulatorState = {
  mixItems: {},
};

export const useSimulatorStore = create<SimulatorState & SimulatorActions>((set) => ({
  ...initialState,

  addGrams: (ingredient, amount) =>
    set((state) => {
      const existing = state.mixItems[ingredient.id];
      return {
        mixItems: {
          ...state.mixItems,
          [ingredient.id]: {
            ingredient,
            grams: (existing?.grams ?? 0) + amount,
          },
        },
      };
    }),

  removeIngredient: (id) =>
    set((state) => {
      const rest = { ...state.mixItems };
      delete rest[id];
      return { mixItems: rest };
    }),

  clearMix: () => set({ mixItems: {} }),

  resetMix: () => set({ mixItems: {} }),
}));
