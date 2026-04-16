import { act, renderHook } from '@testing-library/react-native';

import type { Profile } from '@/types/database';

import { useProfileStore } from '../useProfileStore';

// Mock Supabase client
jest.mock('@/lib/supabase', () => {
  const mockFrom = jest.fn();
  return { supabase: { from: mockFrom } };
});

// Import after mock so we can configure it per test
import { supabase } from '@/lib/supabase';

const mockFrom = supabase.from as jest.Mock;

function makeMixRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'mix-1',
    user_id: 'user-1',
    name: 'Meu Mix',
    created_at: '2026-04-10T12:00:00Z',
    ingredients: ['gergelim', 'feijao-verde'],
    nutrition: { calories: 200, fiber: 5, protein: 10, omega3: 1 },
    ...overrides,
  };
}

function buildChain(resolveValue: unknown) {
  const chain: Record<string, unknown> = {};
  const methods = ['select', 'eq', 'order', 'limit', 'single'];
  methods.forEach((m) => {
    chain[m] = jest.fn(() => chain);
  });
  // Last call in each chain resolves the promise
  (chain['single'] as jest.Mock).mockResolvedValue(resolveValue);
  (chain['limit'] as jest.Mock).mockResolvedValue(resolveValue);
  return chain;
}

beforeEach(() => {
  act(() => {
    useProfileStore.setState({
      profile: null,
      mixes: [],
      isLoading: false,
      error: null,
    });
  });
  mockFrom.mockReset();
});

describe('useProfileStore', () => {
  describe('fetchProfile — sucesso', () => {
    it('popula profile e mixes, isLoading false, error null', async () => {
      const profileData = {
        id: 'user-1',
        name: 'Maria Silva',
        onboarding_completed: true,
        bioactive_profile: null,
        created_at: '2025-01-15T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z',
      };

      const profileChain = buildChain({ data: profileData, error: null });
      const mixesChain = buildChain({ data: [makeMixRow()], error: null });

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount += 1;
        return callCount === 1 ? profileChain : mixesChain;
      });

      const { result } = renderHook(() => useProfileStore());

      await act(async () => {
        await result.current.fetchProfile('user-1');
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.profile).toMatchObject({
        id: 'user-1',
        name: 'Maria Silva',
        onboarding_completed: true,
      });
      expect(result.current.mixes).toHaveLength(1);
      expect(result.current.mixes[0].name).toBe('Meu Mix');
      expect(result.current.mixes[0].ingredients).toEqual(['gergelim', 'feijao-verde']);
    });
  });

  describe('fetchProfile — erro', () => {
    it('define error, mantém mixes vazio, isLoading false', async () => {
      const profileChain = buildChain({
        data: null,
        error: { message: 'Falha na conexão' },
      });

      mockFrom.mockReturnValue(profileChain);

      const { result } = renderHook(() => useProfileStore());

      await act(async () => {
        await result.current.fetchProfile('user-2');
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Falha na conexão');
      expect(result.current.mixes).toHaveLength(0);
      expect(result.current.profile).toBeNull();
    });
  });

  describe('updateName', () => {
    it('atualiza profile.name no estado local em caso de sucesso', async () => {
      const profileData = {
        id: 'user-1',
        name: 'Nome Antigo',
        onboarding_completed: true,
        bioactive_profile: null,
        created_at: '2025-01-15T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z',
      };

      act(() => {
        useProfileStore.setState({ profile: profileData as unknown as Profile });
      });

      const updateChain: Record<string, unknown> = {};
      ['update', 'eq'].forEach((m) => {
        updateChain[m] = jest.fn(() => updateChain);
      });
      (updateChain['eq'] as jest.Mock).mockResolvedValue({ error: null });

      mockFrom.mockReturnValue(updateChain);

      const { result } = renderHook(() => useProfileStore());

      await act(async () => {
        await result.current.updateName('user-1', 'Novo Nome');
      });

      expect(result.current.profile?.name).toBe('Novo Nome');
    });

    it('lança erro quando Supabase retorna erro', async () => {
      const updateChain: Record<string, unknown> = {};
      ['update', 'eq'].forEach((m) => {
        updateChain[m] = jest.fn(() => updateChain);
      });
      (updateChain['eq'] as jest.Mock).mockResolvedValue({
        error: { message: 'Permissão negada' },
      });

      mockFrom.mockReturnValue(updateChain);

      const { result } = renderHook(() => useProfileStore());

      await expect(
        act(async () => {
          await result.current.updateName('user-1', 'Novo Nome');
        }),
      ).rejects.toThrow('Permissão negada');
    });
  });
});
