import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LOCAL_STORAGE_KEY } from './constants';
import { ThemeProvider } from './context';
import { useTheme } from './hooks';

function mockMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: prefersDark,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

beforeEach(() => {
  localStorage.clear();
  mockMatchMedia(false);
});

describe('initialization', () => {
  it('uses stored light scheme from localStorage', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'light');
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.scheme).toBe('light');
  });

  it('uses stored dark scheme from localStorage', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.scheme).toBe('dark');
  });

  it('falls back to dark when OS prefers dark and no localStorage', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.scheme).toBe('dark');
  });

  it('falls back to light when OS prefers light and no localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.scheme).toBe('light');
  });

  it('ignores invalid localStorage value and falls back to OS', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'system');
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    expect(result.current.scheme).toBe('light');
  });
});

describe('toggleScheme', () => {
  it('flips from light to dark', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => {
      result.current.toggleScheme();
    });
    expect(result.current.scheme).toBe('dark');
  });

  it('flips from dark to light', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'dark');
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => {
      result.current.toggleScheme();
    });
    expect(result.current.scheme).toBe('light');
  });

  it('persists new scheme to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => {
      result.current.toggleScheme();
    });
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('dark');
  });

  it('toggleScheme is a stable reference across rerenders', () => {
    const { result, rerender } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    const first = result.current.toggleScheme;
    rerender();
    expect(result.current.toggleScheme).toBe(first);
  });
});

describe('useTheme outside ThemeProvider', () => {
  it('throws the expected error message', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(vi.fn());
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider',
    );
    spy.mockRestore();
  });
});
