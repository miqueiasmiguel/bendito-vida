import { act, renderHook } from '@testing-library/react-native';

import type { Ingredient } from '@/data/ingredients';

import { useSimulatorStore } from '../useSimulatorStore';

const chia: Ingredient = {
  id: 'chia',
  name: 'Chia',
  description: 'Rica em ômega-3.',
  origin: 'Cultivada no Nordeste',
  nutrients: ['omega3', 'fibra', 'calcio'],
  isParaibano: false,
  color: '#2F2F2F',
  nutrition: { calories: 146, fiber: 10.3, protein: 4.9, omega3: 5.4 },
};

const linhaça: Ingredient = {
  id: 'linhaca',
  name: 'Linhaça',
  description: 'Rica em fibras.',
  origin: 'Brasil',
  nutrients: ['fibra', 'omega3'],
  isParaibano: false,
  color: '#8B6914',
  nutrition: { calories: 131, fiber: 7.7, protein: 4.5, omega3: 3.9 },
};

describe('useSimulatorStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useSimulatorStore());
    act(() => result.current.clearMix());
  });

  describe('addGrams', () => {
    it('creates a new entry with the given grams on first add', () => {
      const { result } = renderHook(() => useSimulatorStore());
      act(() => result.current.addGrams(chia, 30));
      expect(result.current.mixItems['chia']).toEqual({ ingredient: chia, grams: 30 });
    });

    it('accumulates grams on repeated taps for the same ingredient', () => {
      const { result } = renderHook(() => useSimulatorStore());
      act(() => result.current.addGrams(chia, 30));
      act(() => result.current.addGrams(chia, 30));
      expect(result.current.mixItems['chia'].grams).toBe(60);
    });

    it('adds multiple different ingredients independently', () => {
      const { result } = renderHook(() => useSimulatorStore());
      act(() => result.current.addGrams(chia, 30));
      act(() => result.current.addGrams(linhaça, 60));
      expect(result.current.mixItems['chia'].grams).toBe(30);
      expect(result.current.mixItems['linhaca'].grams).toBe(60);
    });
  });

  describe('removeIngredient', () => {
    it('removes the ingredient entry from mixItems', () => {
      const { result } = renderHook(() => useSimulatorStore());
      act(() => result.current.addGrams(chia, 30));
      act(() => result.current.removeIngredient('chia'));
      expect(result.current.mixItems['chia']).toBeUndefined();
    });

    it('does not affect other ingredients when removing one', () => {
      const { result } = renderHook(() => useSimulatorStore());
      act(() => result.current.addGrams(chia, 30));
      act(() => result.current.addGrams(linhaça, 60));
      act(() => result.current.removeIngredient('chia'));
      expect(result.current.mixItems['linhaca']).toBeDefined();
      expect(result.current.mixItems['chia']).toBeUndefined();
    });

    it('is a no-op when ingredient is not in the mix', () => {
      const { result } = renderHook(() => useSimulatorStore());
      act(() => result.current.removeIngredient('nonexistent'));
      expect(Object.keys(result.current.mixItems)).toHaveLength(0);
    });
  });

  describe('clearMix', () => {
    it('resets mixItems to an empty object', () => {
      const { result } = renderHook(() => useSimulatorStore());
      act(() => result.current.addGrams(chia, 30));
      act(() => result.current.addGrams(linhaça, 60));
      act(() => result.current.clearMix());
      expect(result.current.mixItems).toEqual({});
    });
  });

  describe('resetMix', () => {
    it('clears all items from a mix with multiple ingredients', () => {
      const { result } = renderHook(() => useSimulatorStore());
      act(() => result.current.addGrams(chia, 30));
      act(() => result.current.addGrams(linhaça, 60));
      act(() => result.current.resetMix());
      expect(result.current.mixItems).toEqual({});
    });

    it('is a no-op on an already empty mix', () => {
      const { result } = renderHook(() => useSimulatorStore());
      act(() => result.current.resetMix());
      expect(result.current.mixItems).toEqual({});
    });
  });
});
