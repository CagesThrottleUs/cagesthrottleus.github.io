import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// async factory — imports lazy AFTER react is resolved, so Component is never undefined.
vi.mock('../../cv/index', async () => {
  const { lazy } = await import('react');

  function entry(label: string, id: string, month: number) {
    const factory = () =>
      Promise.resolve({
        default: function C() {
          return null;
        },
      });
    return { year: 2026, month, id, label, factory, Component: lazy(factory) };
  }

  return {
    monthEntries: [
      entry('June 2026', '2026-06', 6),
      entry('May 2026', '2026-05', 5),
      entry('April 2026', '2026-04', 4),
      entry('March 2026', '2026-03', 3),
    ],
  };
});

class MockIO {
  observe = vi.fn();
  disconnect = vi.fn();
}

beforeEach(() => vi.stubGlobal('IntersectionObserver', MockIO));
afterEach(() => vi.unstubAllGlobals());

import TimelinePage from './component';

describe('TimelinePage', () => {
  it('renders the timeline sidebar navigation', async () => {
    await act(async () => {
      render(<TimelinePage />);
      await Promise.resolve();
    });
    expect(
      screen.getByRole('navigation', { name: 'Timeline navigation' }),
    ).toBeInTheDocument();
  });

  it('renders the batch control', async () => {
    await act(async () => {
      render(<TimelinePage />);
      await Promise.resolve();
    });
    expect(
      screen.getByRole('button', { name: 'Load 3 months at a time' }),
    ).toBeInTheDocument();
  });

  it('renders the first batch of month sections (3 by default)', async () => {
    await act(async () => {
      render(<TimelinePage />);
      await Promise.resolve();
    });
    expect(screen.getByRole('region', { name: 'June 2026' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'May 2026' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'April 2026' })).toBeInTheDocument();
    expect(
      screen.queryByRole('region', { name: 'March 2026' }),
    ).not.toBeInTheDocument();
  });

  it('shows sentinel div when more entries remain', async () => {
    let container!: HTMLElement;
    await act(async () => {
      ({ container } = render(<TimelinePage />));
      await Promise.resolve();
    });
    const sentinel = container.querySelector('[aria-hidden="true"]:not(span)');
    expect(sentinel).toBeInTheDocument();
  });

  it('does not show "All entries loaded" when more entries remain', async () => {
    await act(async () => {
      render(<TimelinePage />);
      await Promise.resolve();
    });
    expect(screen.queryByText('All entries loaded.')).not.toBeInTheDocument();
  });
});
