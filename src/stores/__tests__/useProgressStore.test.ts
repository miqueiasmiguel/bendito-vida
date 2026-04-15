import { act, renderHook } from '@testing-library/react-native';

import { useProgressStore } from '../useProgressStore';

// Mock Supabase client
jest.mock('@/lib/supabase', () => {
  const mockFrom = jest.fn();
  return { supabase: { from: mockFrom } };
});

import { supabase } from '@/lib/supabase';
import type { DailyCheckin } from '@/types/database';

const mockFrom = supabase.from as jest.Mock;

function buildInsertChain(resolveValue: unknown) {
  const chain: Record<string, unknown> = {};
  const methods = ['insert', 'select', 'single'];
  methods.forEach((m) => {
    chain[m] = jest.fn(() => chain);
  });
  (chain['single'] as jest.Mock).mockResolvedValue(resolveValue);
  return chain;
}

const USER_ID = 'user-test-1';
const TODAY = new Date().toLocaleDateString('en-CA');

function makeCheckinRow(date: string): DailyCheckin {
  return {
    id: `id-${date}`,
    user_id: USER_ID,
    date,
    energy_score: 4,
    sleep_score: 3,
    focus_score: 5,
    created_at: new Date().toISOString(),
  };
}

beforeEach(() => {
  act(() => {
    useProgressStore.setState({ checkins: [], isLoading: false, error: null });
  });
  mockFrom.mockReset();
});

describe('useProgressStore', () => {
  describe('addCheckin', () => {
    it("adds a check-in with today's date and correct scores", async () => {
      const row = makeCheckinRow(TODAY);
      mockFrom.mockReturnValue(buildInsertChain({ data: row, error: null }));

      const { result } = renderHook(() => useProgressStore());
      await act(async () => {
        await result.current.addCheckin(USER_ID, {
          energyScore: 4,
          sleepScore: 3,
          focusScore: 5,
        });
      });

      expect(result.current.checkins).toHaveLength(1);
      const c = result.current.checkins[0];
      expect(c.date).toBe(TODAY);
      expect(c.energy_score).toBe(4);
      expect(c.sleep_score).toBe(3);
      expect(c.focus_score).toBe(5);
    });

    it('prevents duplicate check-in on the same day', async () => {
      act(() => {
        useProgressStore.setState({ checkins: [makeCheckinRow(TODAY)] });
      });

      const { result } = renderHook(() => useProgressStore());
      await act(async () => {
        await result.current.addCheckin(USER_ID, { energyScore: 2, sleepScore: 2, focusScore: 2 });
      });

      // Supabase should NOT be called due to optimistic duplicate guard
      expect(mockFrom).not.toHaveBeenCalled();
      expect(result.current.checkins).toHaveLength(1);
      expect(result.current.checkins[0].energy_score).toBe(4);
    });

    it('assigns an id and created_at from Supabase response', async () => {
      const row = makeCheckinRow(TODAY);
      mockFrom.mockReturnValue(buildInsertChain({ data: row, error: null }));

      const { result } = renderHook(() => useProgressStore());
      await act(async () => {
        await result.current.addCheckin(USER_ID, { energyScore: 3, sleepScore: 3, focusScore: 3 });
      });

      const c = result.current.checkins[0];
      expect(c.id).toBeTruthy();
      expect(c.created_at).toBeTruthy();
    });
  });

  describe('getTodayCheckin', () => {
    it('returns undefined when no check-in exists for today', () => {
      const { result } = renderHook(() => useProgressStore());
      expect(result.current.getTodayCheckin()).toBeUndefined();
    });

    it('returns the check-in for today', async () => {
      const row = makeCheckinRow(TODAY);
      mockFrom.mockReturnValue(buildInsertChain({ data: row, error: null }));

      const { result } = renderHook(() => useProgressStore());
      await act(async () => {
        await result.current.addCheckin(USER_ID, { energyScore: 5, sleepScore: 4, focusScore: 3 });
      });

      const found = result.current.getTodayCheckin();
      expect(found).toBeDefined();
      expect(found?.date).toBe(TODAY);
    });

    it('does not return check-ins from a different date', () => {
      const { result } = renderHook(() => useProgressStore());
      act(() => {
        useProgressStore.setState({
          checkins: [makeCheckinRow('1999-01-01')],
        });
      });
      expect(result.current.getTodayCheckin()).toBeUndefined();
    });
  });
});
