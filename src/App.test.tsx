import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockMatchMedia } from './test/providers';

vi.mock('./posts/promise', () => ({
  postsPromise: Promise.resolve([]),
}));

import App from './App';

async function renderApp(path = '/') {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );
  });
}

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  describe('layout landmarks', () => {
    it('renders the site header (banner landmark)', async () => {
      await renderApp();
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders the site footer (contentinfo landmark)', async () => {
      await renderApp();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders the main content area', async () => {
      await renderApp();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('S2 Provider', () => {
    it('mounts the S2 Provider element with id="core-app-provider"', async () => {
      await renderApp();
      expect(document.getElementById('core-app-provider')).toBeInTheDocument();
    });
  });

  describe('re-render stability', () => {
    it('re-renders without regression (React Compiler cache-hit branches)', async () => {
      let rerenderFn!: ReturnType<typeof render>['rerender'];
      await act(async () => {
        const { rerender } = render(
          <MemoryRouter>
            <App />
          </MemoryRouter>,
        );
        rerenderFn = rerender;
      });
      await act(async () => {
        rerenderFn(
          <MemoryRouter>
            <App />
          </MemoryRouter>,
        );
      });
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('ThemeProvider integration', () => {
    it('renders the theme toggle button in the header', async () => {
      await renderApp();
      expect(
        screen.getByRole('button', { name: /switch to/i }),
      ).toBeInTheDocument();
    });

    it('starts in light mode when localStorage has no preference and OS prefers light', async () => {
      await renderApp();
      expect(
        screen.getByRole('button', { name: 'Switch to dark theme' }),
      ).toBeInTheDocument();
    });

    it('starts in dark mode when localStorage is set to dark', async () => {
      localStorage.setItem('color-scheme', 'dark');
      await renderApp();
      expect(
        screen.getByRole('button', { name: 'Switch to light theme' }),
      ).toBeInTheDocument();
    });
  });
});
