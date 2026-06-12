import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MonthEntry } from '../../cv/types';

// vi.mock is hoisted — variables it references must also be hoisted.
const { mockEntries } = vi.hoisted(() => {
  const entries: MonthEntry[] = [
    {
      year: 2026,
      month: 6,
      id: '2026-06',
      label: 'June 2026',
      factory: () =>
        Promise.resolve({ default: function C() { return <li>June entry</li>; } }),
    },
    {
      year: 2026,
      month: 5,
      id: '2026-05',
      label: 'May 2026',
      factory: () =>
        Promise.resolve({ default: function C() { return <li>May entry</li>; } }),
    },
    {
      year: 2026,
      month: 4,
      id: '2026-04',
      label: 'April 2026',
      factory: () =>
        Promise.resolve({ default: function C() { return <li>April entry</li>; } }),
    },
    {
      year: 2026,
      month: 3,
      id: '2026-03',
      label: 'March 2026',
      factory: () =>
        Promise.resolve({ default: function C() { return <li>March entry</li>; } }),
    },
  ];
  return { mockEntries: entries };
});

vi.mock('../../cv/index', () => ({ monthEntries: mockEntries }));

class MockIO {
  observe = vi.fn();
  disconnect = vi.fn();
  constructor() {}
}

beforeEach(() => vi.stubGlobal('IntersectionObserver', MockIO));
afterEach(() => vi.unstubAllGlobals());

import TimelinePage from './component';

describe('TimelinePage', () => {
  it('renders the timeline sidebar navigation', async () => {
    await act(async () => { render(<TimelinePage />); });
    expect(
      screen.getByRole('navigation', { name: 'Timeline navigation' }),
    ).toBeInTheDocument();
  });

  it('renders the batch control', async () => {
    await act(async () => { render(<TimelinePage />); });
    expect(
      screen.getByRole('button', { name: 'Load 3 months at a time' }),
    ).toBeInTheDocument();
  });

  it('renders the first batch of month sections (3 by default)', async () => {
    await act(async () => { render(<TimelinePage />); });
    expect(screen.getByRole('region', { name: 'June 2026' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'May 2026' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'April 2026' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'March 2026' })).not.toBeInTheDocument();
  });

  it('shows sentinel div when more entries remain', async () => {
    const { container } = await act(async () => render(<TimelinePage />));
    // hasMore is true (4 entries, only 3 loaded) → sentinel div rendered
    const sentinel = container.querySelector('[aria-hidden="true"]:not(span)');
    expect(sentinel).toBeInTheDocument();
  });

  it('does not show "All entries loaded" when more entries remain', async () => {
    // 4 mock entries, batch 3 → hasMore=true → end-note absent, sentinel present.
    // The hasMore=false → "All entries loaded." path is covered by useInfiniteMonths tests.
    await act(async () => { render(<TimelinePage />); });
    expect(screen.queryByText('All entries loaded.')).not.toBeInTheDocument();
  });
});
