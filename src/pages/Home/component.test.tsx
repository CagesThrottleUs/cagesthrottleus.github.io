import { ToastQueue } from '@react-spectrum/s2';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import { Suspense } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockMatchMedia, renderWithProviders } from '../../test/providers';

// WaterfallLayout computes column widths from CSS variables that resolve to 0
// in jsdom, causing RangeError. Swap CardView for a simple accessible equivalent.
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

const { mockPost } = vi.hoisted(() => ({
  mockPost: {
    id: 'hello-world',
    title: 'Hello World',
    abstract: 'An introduction to this blog',
    preview: 'https://example.com/preview.jpg',
    createdAt: '2026-06-08',
    Component: function MockPost() {
      return null;
    },
  },
}));

vi.mock('../../posts/promise', () => ({
  postsPromise: Promise.resolve([mockPost]),
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

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
    Object.defineProperty(navigator, 'clipboard', {
      writable: true,
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  describe('loaded state with posts', () => {
    it('renders the blog posts grid after resolving', async () => {
      await renderHome();
      expect(
        screen.getByRole('grid', { name: /blog posts$/i }),
      ).toBeInTheDocument();
    });

    it('renders the post title in the card', async () => {
      await renderHome();
      expect(screen.getAllByText('Hello World').length).toBeGreaterThan(0);
    });

    it('renders the post abstract in the card description slot', async () => {
      await renderHome();
      expect(
        screen.getByText('An introduction to this blog'),
      ).toBeInTheDocument();
    });

    it('shows "Published" status on the card', async () => {
      await renderHome();
      expect(screen.getByText('Published')).toBeInTheDocument();
    });

    it('skeleton grid is gone after posts load', async () => {
      await renderHome();
      expect(
        screen.queryByRole('grid', { name: /loading blog posts/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('re-render stability', () => {
    it('re-renders with same props without changing output (React Compiler cache-hit branches)', async () => {
      let rerenderFn!: ReturnType<typeof renderWithProviders>['rerender'];
      await act(async () => {
        const { rerender } = renderWithProviders(
          <Suspense fallback={<div>Loading...</div>}>
            <HomePage />
          </Suspense>,
        );
        rerenderFn = rerender;
        await Promise.resolve();
      });
      // Same component, same resolved props → hits React Compiler's memoization else-branches
      await act(async () => {
        rerenderFn(
          <Suspense fallback={<div>Loading...</div>}>
            <HomePage />
          </Suspense>,
        );
        await Promise.resolve();
      });
      expect(
        screen.getByRole('grid', { name: /blog posts$/i }),
      ).toBeInTheDocument();
    });
  });

  describe('copy action', () => {
    it('opening the ActionMenu and activating Copy calls clipboard.writeText', async () => {
      const toastSpy = vi
        .spyOn(ToastQueue, 'neutral')
        .mockImplementation(vi.fn());
      const user = userEvent.setup();
      // Spy AFTER userEvent.setup() so we intercept whatever clipboard it uses
      const clipboardSpy = vi
        .spyOn(navigator.clipboard, 'writeText')
        .mockResolvedValue(undefined);

      await renderHome();

      // ActionMenu trigger label is "More actions" (S2 en-US locale default)
      const trigger = screen.getByRole('button', { name: 'More actions' });
      await user.click(trigger);

      // Menu is open — first item is auto-focused; activate with keyboard
      const copyItem = await screen.findByRole('menuitem', { name: /copy/i });
      await user.click(copyItem);

      // onAction is async — poll until the clipboard call resolves
      await waitFor(
        () => {
          expect(clipboardSpy).toHaveBeenCalledWith(
            expect.stringContaining('hello-world'),
          );
        },
        { timeout: 3000 },
      );
      clipboardSpy.mockRestore();
      toastSpy.mockRestore();
    });
  });
});
