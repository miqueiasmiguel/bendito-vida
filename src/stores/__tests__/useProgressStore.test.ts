import { act, renderHook } from '@testing-library/react-native';

import { getCurrentISOWeek, useProgressStore } from '../useProgressStore';

// Reset store between tests
beforeEach(() => {
  act(() => {
    useProgressStore.setState({ checkins: [] });
  });
});

describe('useProgressStore', () => {
  describe('addCheckin', () => {
    it('adds a check-in with the current ISO week and correct scores', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.addCheckin({ energyScore: 4, sleepScore: 3, focusScore: 5 });
      });
      expect(result.current.checkins).toHaveLength(1);
      const c = result.current.checkins[0];
      expect(c.week).toBe(getCurrentISOWeek());
      expect(c.energyScore).toBe(4);
      expect(c.sleepScore).toBe(3);
      expect(c.focusScore).toBe(5);
    });

    it('prevents duplicate check-in in the same ISO week', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.addCheckin({ energyScore: 4, sleepScore: 3, focusScore: 5 });
      });
      act(() => {
        result.current.addCheckin({ energyScore: 2, sleepScore: 2, focusScore: 2 });
      });
      expect(result.current.checkins).toHaveLength(1);
      expect(result.current.checkins[0].energyScore).toBe(4);
    });

    it('assigns an id and createdAt timestamp', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.addCheckin({ energyScore: 3, sleepScore: 3, focusScore: 3 });
      });
      const c = result.current.checkins[0];
      expect(c.id).toBeTruthy();
      expect(c.createdAt).toBeGreaterThan(0);
    });
  });

  describe('getCurrentWeekCheckin', () => {
    it('returns undefined when no check-in exists for current week', () => {
      const { result } = renderHook(() => useProgressStore());
      expect(result.current.getCurrentWeekCheckin()).toBeUndefined();
    });

    it('returns the check-in for the current week', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        result.current.addCheckin({ energyScore: 5, sleepScore: 4, focusScore: 3 });
      });
      const found = result.current.getCurrentWeekCheckin();
      expect(found).toBeDefined();
      expect(found?.week).toBe(getCurrentISOWeek());
    });

    it('does not return check-ins from a different week', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        useProgressStore.setState({
          checkins: [
            {
              id: 'old',
              week: '1999-W01',
              energyScore: 3,
              sleepScore: 3,
              focusScore: 3,
              createdAt: Date.now(),
            },
          ],
        });
      });
      expect(result.current.getCurrentWeekCheckin()).toBeUndefined();
    });
  });
});
