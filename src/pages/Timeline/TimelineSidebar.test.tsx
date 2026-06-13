import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { lazy } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MonthEntry } from '../../cv/types';
import { TimelineSidebar } from './TimelineSidebar';

function makeEntries(...ids: string[]): MonthEntry[] {
  return ids.map((id) => {
    const [year, month] = id.split('-').map(Number);
    const factory = () => Promise.resolve({ default: () => null });
    return {
      year,
      month,
      id,
      label: new Date(year, month - 1, 1).toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      Component: lazy(factory),
    };
  });
}

class MockIO {
  observe = vi.fn();
  disconnect = vi.fn();
}

beforeEach(() => vi.stubGlobal('IntersectionObserver', MockIO));
afterEach(() => vi.unstubAllGlobals());

describe('TimelineSidebar', () => {
  it('renders a navigation landmark with the correct label', () => {
    render(<TimelineSidebar entries={makeEntries('2026-06')} />);
    expect(
      screen.getByRole('navigation', { name: 'Timeline navigation' }),
    ).toBeInTheDocument();
  });

  it('renders a month button for each entry', () => {
    render(<TimelineSidebar entries={makeEntries('2026-06', '2026-05')} />);
    expect(
      screen.getByRole('button', { name: 'June 2026' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'May 2026' }),
    ).toBeInTheDocument();
  });

  it('the first entry is active by default (aria-current="location")', () => {
    render(<TimelineSidebar entries={makeEntries('2026-06', '2026-05')} />);
    expect(screen.getByRole('button', { name: 'June 2026' })).toHaveAttribute(
      'aria-current',
      'location',
    );
    expect(
      screen.getByRole('button', { name: 'May 2026' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('groups entries under their year', () => {
    render(<TimelineSidebar entries={makeEntries('2026-06', '2025-12')} />);
    expect(
      screen.getByRole('button', { name: 'June 2026' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'December 2025' }),
    ).toBeInTheDocument();
  });

  it('clicking a month button calls scrollIntoView on the target element', async () => {
    const user = userEvent.setup();
    const mockScrollIntoView = vi.fn();
    const el = document.createElement('div');
    el.id = 'month-2026-06';
    el.scrollIntoView = mockScrollIntoView;
    document.body.appendChild(el);

    render(<TimelineSidebar entries={makeEntries('2026-06')} />);
    await user.click(screen.getByRole('button', { name: 'June 2026' }));
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(el);
  });

  it('renders nothing but the nav when entries array is empty', () => {
    render(<TimelineSidebar entries={[]} />);
    const nav = screen.getByRole('navigation', { name: 'Timeline navigation' });
    expect(nav).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
