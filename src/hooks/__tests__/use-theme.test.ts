import { renderHook } from '@testing-library/react-native';

import { useTheme } from '../use-theme';

const mockUseColorScheme = jest.fn();

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => mockUseColorScheme(),
}));

describe('useTheme', () => {
  it('returns light theme when scheme is light', () => {
    mockUseColorScheme.mockReturnValue('light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.text).toBe('#000000');
    expect(result.current.background).toBe('#ffffff');
  });

  it('returns dark theme when scheme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.text).toBe('#ffffff');
    expect(result.current.background).toBe('#000000');
  });

  it('falls back to light theme when scheme is unspecified', () => {
    mockUseColorScheme.mockReturnValue('unspecified');
    const { result } = renderHook(() => useTheme());
    expect(result.current.text).toBe('#000000');
    expect(result.current.background).toBe('#ffffff');
  });

  it('returns defined theme colors for all known keys', () => {
    mockUseColorScheme.mockReturnValue('light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.backgroundElement).toBeDefined();
    expect(result.current.backgroundSelected).toBeDefined();
    expect(result.current.textSecondary).toBeDefined();
  });
});
