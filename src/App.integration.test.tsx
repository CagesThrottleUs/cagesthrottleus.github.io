// Integration: full App tree. Only postsPromise and CardView are mocked.
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockMatchMedia } from './test/providers';

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
        ? items.map((item: unknown) => (
            <div key={(item as { id: string }).id}>
              {(children as (i: unknown) => React.ReactNode)(item)}
            </div>
          ))
        : (children as React.ReactNode)}
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

const { integrationPost } = vi.hoisted(() => ({
  integrationPost: {
    id: '2026-06-08-hello-world',
    title: 'Hello World',
    abstract: 'An introduction to this blog',
    preview: 'https://example.com/preview.jpg',
    createdAt: '2026-06-08',
    Component: function MockPost() {
      return null;
    },
  },
}));

vi.mock('./posts/promise', () => ({
  postsPromise: Promise.resolve([integrationPost]),
}));

import App from './App';

async function renderApp(path = '/') {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );
    await Promise.resolve();
  });
}

describe('App integration', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  describe('layout on every route', () => {
    it('header and footer are visible on the home route', async () => {
      await renderApp('/');
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('header and footer are visible on a post route', async () => {
      await renderApp('/posts/2026-06-08-hello-world');
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('theme toggle state', () => {
    it('clicking toggle updates aria-pressed from false to true', async () => {
      const user = userEvent.setup();
      await renderApp('/');
      const toggle = screen.getByRole('button', {
        name: 'Switch to dark theme',
      });
      expect(toggle).toHaveAttribute('aria-pressed', 'false');
      await user.click(toggle);
      expect(toggle).toHaveAttribute('aria-pressed', 'true');
    });

    it('toggling twice returns aria-pressed to false', async () => {
      const user = userEvent.setup();
      await renderApp('/');
      await user.click(
        screen.getByRole('button', { name: 'Switch to dark theme' }),
      );
      await user.click(
        screen.getByRole('button', { name: 'Switch to light theme' }),
      );
      expect(
        screen.getByRole('button', { name: 'Switch to dark theme' }),
      ).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('post route behaviour', () => {
    it('"Back To Home" button appears on a valid post route', async () => {
      await renderApp('/posts/2026-06-08-hello-world');
      expect(
        screen.getByRole('button', { name: /back to home/i }),
      ).toBeInTheDocument();
    });

    it('"Post not found" shown for an unknown slug', async () => {
      await renderApp('/posts/unknown-slug');
      expect(screen.getByText('Post not found')).toBeInTheDocument();
    });
  });
});
