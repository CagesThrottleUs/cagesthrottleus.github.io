import { Provider } from '@react-spectrum/s2';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mockMatchMedia } from './test/providers';
import { ThemeProvider } from './ThemeProvider/context';

const { mockPost } = vi.hoisted(() => ({
  mockPost: {
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
  postsPromise: Promise.resolve([mockPost]),
}));

vi.mock('./cv/index', () => ({
  monthEntries: [
    {
      year: 2026,
      month: 6,
      id: '2026-06',
      label: 'June 2026',
      factory: () => Promise.resolve({ default: () => null }),
    },
  ],
}));

import AppRoutes from './routes';

async function renderAtPath(path: string) {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <ThemeProvider>
          <Provider background="base">
            <AppRoutes />
          </Provider>
        </ThemeProvider>
      </MemoryRouter>,
    );
    await Promise.resolve();
  });
}

describe('AppRoutes', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
    vi.stubGlobal('IntersectionObserver', class {
      observe = vi.fn();
      disconnect = vi.fn();
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  describe('home route (/)', () => {
    it('renders the site header', async () => {
      await renderAtPath('/');
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders the main landmark', async () => {
      await renderAtPath('/');
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('renders the site footer', async () => {
      await renderAtPath('/');
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('post route — found (/posts/:slug)', () => {
    it('renders "Back To Home" when the slug matches a known post', async () => {
      await renderAtPath('/posts/2026-06-08-hello-world');
      expect(
        screen.getByRole('button', { name: /back to home/i }),
      ).toBeInTheDocument();
    });

    it('does not show "Post not found" for a valid slug', async () => {
      await renderAtPath('/posts/2026-06-08-hello-world');
      expect(screen.queryByText('Post not found')).not.toBeInTheDocument();
    });
  });

  describe('re-render stability', () => {
    it('re-renders at home route without regression (React Compiler cache-hit branches)', async () => {
      await renderAtPath('/');
      await act(async () => {
        render(
          <MemoryRouter initialEntries={['/']}>
            <ThemeProvider>
              <Provider background="base">
                <AppRoutes />
              </Provider>
            </ThemeProvider>
          </MemoryRouter>,
        );
        await Promise.resolve();
      });
      expect(screen.getAllByRole('banner').length).toBeGreaterThan(0);
    });
  });

  describe('timeline route (/timeline)', () => {
    it('renders the timeline sidebar navigation', async () => {
      await renderAtPath('/timeline');
      // TimelinePage is lazy — findByRole waits for the import to resolve.
      await expect(
        screen.findByRole('navigation', { name: 'Timeline navigation' }),
      ).resolves.toBeInTheDocument();
    });
  });

  describe('wildcard route (*)', () => {
    it('shows "Page not found" for an unrecognised path', async () => {
      await renderAtPath('/this/does/not/exist');
      expect(screen.getByText('Page not found')).toBeInTheDocument();
    });
  });

  describe('post route — not found', () => {
    it('shows "Post not found" heading for an unknown slug', async () => {
      await renderAtPath('/posts/does-not-exist');
      expect(screen.getByText('Post not found')).toBeInTheDocument();
    });

    it('includes the unknown slug in the not-found message', async () => {
      await renderAtPath('/posts/mystery-post');
      expect(
        screen.getByText(/no post exists with the slug "mystery-post"/i),
      ).toBeInTheDocument();
    });
  });
});
