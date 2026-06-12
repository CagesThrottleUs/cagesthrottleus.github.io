import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { MonthEntry } from '../../cv/types';
import { MonthSection } from './MonthSection';

function makeEntry(overrides?: Partial<MonthEntry>): MonthEntry {
  return {
    year: 2026,
    month: 6,
    id: '2026-06',
    label: 'June 2026',
    factory: () =>
      Promise.resolve({
        default: function Content() {
          return <li>Test entry</li>;
        },
      }),
    ...overrides,
  };
}

describe('MonthSection', () => {
  it('renders the month label as a heading', async () => {
    await act(async () => { render(<MonthSection entry={makeEntry()} />); });
    expect(screen.getByRole('heading', { name: 'June 2026' })).toBeInTheDocument();
  });

  it('renders a region landmark with the month label', async () => {
    await act(async () => { render(<MonthSection entry={makeEntry()} />); });
    expect(screen.getByRole('region', { name: 'June 2026' })).toBeInTheDocument();
  });

  it('sets id="month-{entry.id}" for anchor navigation', async () => {
    let container!: HTMLElement;
    await act(async () => { ({ container } = render(<MonthSection entry={makeEntry()} />)); });
    expect(container.querySelector('#month-2026-06')).toBeInTheDocument();
  });

  it('sets data-month-section and data-month-id for sidebar tracking', async () => {
    let container!: HTMLElement;
    await act(async () => { ({ container } = render(<MonthSection entry={makeEntry()} />)); });
    const section = container.querySelector('[data-month-section]');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('data-month-id', '2026-06');
  });

  it('shows a loading indicator while lazy content resolves', async () => {
    let resolve!: () => void;
    const factory = () =>
      new Promise<{ default: () => null }>((res) => {
        resolve = () => res({ default: () => null });
      });
    render(<MonthSection entry={makeEntry({ factory })} />);
    expect(screen.getByRole('progressbar', { name: 'Loading June 2026' })).toBeInTheDocument();
    await act(async () => resolve());
  });

  it('renders lazy content after the factory resolves', async () => {
    await act(async () => {
      render(<MonthSection entry={makeEntry()} />);
    });
    expect(screen.getByText('Test entry')).toBeInTheDocument();
  });
});
