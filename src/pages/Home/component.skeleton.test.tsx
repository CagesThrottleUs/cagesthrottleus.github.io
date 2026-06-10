// Skeleton / loading-state tests use a never-resolving promise so Suspense
// stays in its fallback indefinitely — no act() warning, no timing race.
import { act, screen } from '@testing-library/react';
import type React from 'react';
import { Suspense } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockMatchMedia, renderWithProviders } from '../../test/providers';

vi.mock('@react-spectrum/s2/CardView', () => ({
  Card: ({ children, id, textValue }: { children: React.ReactNode; id?: string; textValue?: string }) => (
    <article id={id} aria-label={textValue}>{children}</article>
  ),
  CardPreview: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardView: ({ 'aria-label': label, items, children }: {
    'aria-label'?: string;
    items?: unknown[];
    children: ((item: unknown) => React.ReactNode) | React.ReactNode;
  }) => (
    <div role="grid" aria-label={label}>
      {Array.isArray(items)
        ? items.map((item: any) => (
            <div key={item.id ?? String(item)}>
              {(children as (item: unknown) => React.ReactNode)(item)}
            </div>
          ))
        : children}
    </div>
  ),
  Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Footer: ({ children }: { children: React.ReactNode }) => <footer>{children}</footer>,
  Image: ({ alt, src }: { alt?: string; src?: string }) => <img alt={alt} src={src || undefined} />,
  SkeletonCollection: ({ children }: { children: () => React.ReactNode }) => <>{children()}</>,
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

// Never resolves — Suspense stays in fallback state for the entire test.
vi.mock('../../posts/promise', () => ({
  postsPromise: new Promise<never>(() => {}),
}));

import HomePage from './component';

describe('HomePage — loading (skeleton) state', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  // Use await act(async) so React can go idle after suspending.
  // The never-resolving promise means React shows the fallback and then
  // has no more work to do — act() exits cleanly without any warning.
  it('shows the skeleton grid while posts are still loading', async () => {
    await act(async () => {
      renderWithProviders(
        <Suspense fallback={<div>Loading...</div>}>
          <HomePage />
        </Suspense>,
      );
    });
    expect(
      screen.getByRole('grid', { name: /loading blog posts/i }),
    ).toBeInTheDocument();
  });

  it('does not show the loaded posts grid during loading', async () => {
    await act(async () => {
      renderWithProviders(
        <Suspense fallback={<div>Loading...</div>}>
          <HomePage />
        </Suspense>,
      );
    });
    // The skeleton grid has aria-label="Loading blog posts"; the loaded grid
    // has aria-label="Blog posts". Exact match avoids matching the skeleton.
    expect(
      screen.queryByRole('grid', { name: 'Blog posts' }),
    ).not.toBeInTheDocument();
  });
});
