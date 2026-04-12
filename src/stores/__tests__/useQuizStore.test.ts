import { act, renderHook } from '@testing-library/react-native';

import type { NutrientTag } from '@/data/quiz-questions';
import { useQuizStore } from '../useQuizStore';

// Reset store between tests
beforeEach(() => {
  act(() => {
    useQuizStore.getState().reset();
  });
});

describe('useQuizStore', () => {
  describe('setAnswer (single-select)', () => {
    it('stores the selected option', () => {
      const { result } = renderHook(() => useQuizStore());
      act(() => result.current.setAnswer('q1', 'q1-energia', false));
      expect(result.current.answers['q1']).toEqual(['q1-energia']);
    });

    it('replaces previous selection', () => {
      const { result } = renderHook(() => useQuizStore());
      act(() => result.current.setAnswer('q1', 'q1-energia', false));
      act(() => result.current.setAnswer('q1', 'q1-foco', false));
      expect(result.current.answers['q1']).toEqual(['q1-foco']);
    });
  });

  describe('setAnswer (multi-select)', () => {
    it('accumulates multiple selections', () => {
      const { result } = renderHook(() => useQuizStore());
      act(() => result.current.setAnswer('q4', 'q4-gluten', true));
      act(() => result.current.setAnswer('q4', 'q4-lactose', true));
      expect(result.current.answers['q4']).toEqual(['q4-gluten', 'q4-lactose']);
    });

    it('deselects when tapping an already-selected option', () => {
      const { result } = renderHook(() => useQuizStore());
      act(() => result.current.setAnswer('q4', 'q4-gluten', true));
      act(() => result.current.setAnswer('q4', 'q4-gluten', true));
      expect(result.current.answers['q4']).toEqual([]);
    });

    it('"Nenhuma" clears all other selections', () => {
      const { result } = renderHook(() => useQuizStore());
      act(() => result.current.setAnswer('q4', 'q4-gluten', true));
      act(() => result.current.setAnswer('q4', 'q4-lactose', true));
      act(() => result.current.setAnswer('q4', 'q4-nenhuma', true));
      expect(result.current.answers['q4']).toEqual(['q4-nenhuma']);
    });

    it('selecting another option removes "Nenhuma"', () => {
      const { result } = renderHook(() => useQuizStore());
      act(() => result.current.setAnswer('q4', 'q4-nenhuma', true));
      act(() => result.current.setAnswer('q4', 'q4-gluten', true));
      expect(result.current.answers['q4']).toEqual(['q4-gluten']);
      expect(result.current.answers['q4']).not.toContain('q4-nenhuma');
    });
  });

  describe('setProfile', () => {
    it('stores the nutrition profile', () => {
      const { result } = renderHook(() => useQuizStore());
      const profile = {
        topNutrients: ['omega3', 'magnesio', 'vitamina-b12'] as NutrientTag[],
        suggestedIngredients: [],
      };
      act(() => result.current.setProfile(profile));
      expect(result.current.nutritionProfile).toEqual(profile);
    });
  });

  describe('reset', () => {
    it('clears answers and profile', () => {
      const { result } = renderHook(() => useQuizStore());
      act(() => result.current.setAnswer('q1', 'q1-foco', false));
      act(() => result.current.reset());
      expect(result.current.answers).toEqual({});
      expect(result.current.nutritionProfile).toBeNull();
    });
  });
});
