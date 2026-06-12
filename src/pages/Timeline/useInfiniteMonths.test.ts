import { act, renderHook } from '@testing-library/react';
import { lazy } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MonthEntry } from '../../cv/types';
import { useInfiniteMonths } from './useInfiniteMonths';

function makeEntries(n: number): MonthEntry[] {
  return Array.from({ length: n }, (_, i) => {
    const factory = () => Promise.resolve({ default: () => null });
    return {
      year: 2026,
      month: 12 - i,
      id: `2026-${String(12 - i).padStart(2, '0')}`,
      label: `Month ${String(12 - i)} 2026`,
      factory,
      Component: lazy(factory),
    };
  });
}

// ── IntersectionObserver class mock ───────────────────────────────────────────

type IOCallback = (entries: { isIntersecting: boolean }[]) => void;
let lastTrigger: ((v: boolean) => void) | null = null;
let lastDisconnect: ReturnType<typeof vi.fn> | null = null;

class MockIO {
  observe = vi.fn();
  disconnect = vi.fn();

  constructor(cb: IOCallback) {
    const { disconnect } = this;
    lastTrigger = (v: boolean) => {
      cb([{ isIntersecting: v }]);
    };
    lastDisconnect = disconnect;
  }
}

beforeEach(() => {
  lastTrigger = null;
  lastDisconnect = null;
  vi.stubGlobal('IntersectionObserver', MockIO);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ─────────────────────────────────────────────────────────────────────────────

describe('useInfiniteMonths', () => {
  it('returns the first 3 entries initially', () => {
    const { result } = renderHook(() => useInfiniteMonths(makeEntries(10)));
    expect(result.current.loadedMonths).toHaveLength(3);
  });

  it('loads all entries when total is less than batch size', () => {
    const { result } = renderHook(() => useInfiniteMonths(makeEntries(2)));
    expect(result.current.loadedMonths).toHaveLength(2);
  });

  it('hasMore is true when not all entries are loaded', () => {
    const { result } = renderHook(() => useInfiniteMonths(makeEntries(10)));
    expect(result.current.hasMore).toBe(true);
  });

  it('hasMore is false when all entries are loaded', () => {
    const { result } = renderHook(() => useInfiniteMonths(makeEntries(2)));
    expect(result.current.hasMore).toBe(false);
  });

  it('loads next batch when sentinel is intersected', () => {
    const { result } = renderHook(() => useInfiniteMonths(makeEntries(10)));
    act(() => {
      result.current.sentinelRef(document.createElement('div'));
    });
    expect(lastTrigger).not.toBeNull();
    act(() => {
      lastTrigger!(true);
    });
    expect(result.current.loadedMonths).toHaveLength(6);
  });

  it('does not load past total entries', () => {
    const { result } = renderHook(() => useInfiniteMonths(makeEntries(4)));
    act(() => {
      result.current.sentinelRef(document.createElement('div'));
    });
    act(() => {
      lastTrigger!(true);
    });
    expect(result.current.loadedMonths).toHaveLength(4);
    expect(result.current.hasMore).toBe(false);
  });

  it('setBatchSize changes next load increment', () => {
    const { result } = renderHook(() => useInfiniteMonths(makeEntries(20)));
    act(() => {
      result.current.sentinelRef(document.createElement('div'));
    });
    act(() => {
      result.current.setBatchSize(6);
    });
    act(() => {
      lastTrigger!(true);
    });
    expect(result.current.loadedMonths).toHaveLength(9); // 3 initial + 6
  });

  it('does not load when intersection is false', () => {
    const { result } = renderHook(() => useInfiniteMonths(makeEntries(10)));
    act(() => {
      result.current.sentinelRef(document.createElement('div'));
    });
    act(() => {
      lastTrigger!(false);
    });
    expect(result.current.loadedMonths).toHaveLength(3);
  });

  it('disconnects observer on unmount', () => {
    const { result, unmount } = renderHook(() =>
      useInfiniteMonths(makeEntries(10)),
    );
    act(() => {
      result.current.sentinelRef(document.createElement('div'));
    });
    expect(lastDisconnect).not.toBeNull();
    unmount();
    expect(lastDisconnect).toHaveBeenCalled();
  });

  it('sentinelRef is a callable function', () => {
    const { result } = renderHook(() => useInfiniteMonths(makeEntries(10)));
    expect(typeof result.current.sentinelRef).toBe('function');
  });
});
