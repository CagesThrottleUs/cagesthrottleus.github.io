import { act, screen } from '@testing-library/react';
import type React from 'react';
import { Suspense } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockMatchMedia, renderWithProviders } from '../../test/providers';

vi.mock('@react-spectrum/s2/CardView', () => ({
  Card: ({
    children,
    id,
    textValue,
  }: {
    children: React.ReactNode;
    id?: string;
    textValue?: string;
  }) => (
    <article id={id} aria-label={textValue}>
      {children}
    </article>
  ),
  CardPreview: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardView: ({
    'aria-label': label,
    items,
    children,
  }: {
    'aria-label'?: string;
    items?: unknown[];
    children: ((item: unknown) => React.ReactNode) | React.ReactNode;
  }) => (
    <div role="grid" aria-label={label}>
      {Array.isArray(items)
        ? items.map((item: { id?: string }, index: number) => (
            <div key={item.id ?? String(index)}>
              {(children as (item: unknown) => React.ReactNode)(item)}
            </div>
          ))
        : children}
    </div>
  ),
  Content: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Footer: ({ children }: { children: React.ReactNode }) => (
    <footer>{children}</footer>
  ),
  Image: ({ alt, src }: { alt?: string; src?: string }) => (
    <img alt={alt} src={src !== '' ? src : undefined} />
  ),
  SkeletonCollection: ({ children }: { children: () => React.ReactNode }) => (
    <>{children()}</>
  ),
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

vi.mock('../../posts/promise', () => ({
  postsPromise: Promise.resolve([]),
}));

import HomePage from './component';

async function renderHome() {
  await act(async () => {
    renderWithProviders(
      <Suspense fallback={<div>Loading...</div>}>
        <HomePage />
      </Suspense>,
    );
    await Promise.resolve();
  });
}

describe('HomePage — empty state', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  it('shows "No posts yet" heading when there are no posts', async () => {
    await renderHome();
    expect(document.body.textContent).toMatch(/no posts yet/i);
  });

  it('shows the "Check back soon" message', async () => {
    await renderHome();
    expect(screen.getByText(/check back soon/i)).toBeInTheDocument();
  });

  it('does not render a posts grid when empty', async () => {
    await renderHome();
    expect(
      screen.queryByRole('grid', { name: /blog posts$/i }),
    ).not.toBeInTheDocument();
  });
});
