import { create } from 'zustand';

import type { Ingredient } from '@/data/ingredients';

interface SimulatorState {
  selectedIngredients: Ingredient[];
}

interface SimulatorActions {
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (ingredientId: string) => void;
  toggleIngredient: (ingredient: Ingredient) => void;
  clearMix: () => void;
}

const initialState: SimulatorState = {
  selectedIngredients: [],
};

export const useSimulatorStore = create<SimulatorState & SimulatorActions>((set) => ({
  ...initialState,

  addIngredient: (ingredient) =>
    set((state) => ({
      selectedIngredients: [...state.selectedIngredients, ingredient],
    })),

  removeIngredient: (ingredientId) =>
    set((state) => ({
      selectedIngredients: state.selectedIngredients.filter((i) => i.id !== ingredientId),
    })),

  toggleIngredient: (ingredient) =>
    set((state) => {
      const isSelected = state.selectedIngredients.some((i) => i.id === ingredient.id);
      if (isSelected) {
        return {
          selectedIngredients: state.selectedIngredients.filter((i) => i.id !== ingredient.id),
        };
      }
      return { selectedIngredients: [...state.selectedIngredients, ingredient] };
    }),

  clearMix: () => set(initialState),
}));
