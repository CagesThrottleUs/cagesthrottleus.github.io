import { Provider } from '@react-spectrum/s2';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockMatchMedia } from './test/providers';
import { ThemeProvider } from './ThemeProvider/context';

vi.mock('./posts/promise', () => ({
  postsPromise: Promise.resolve([]),
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

describe('AppRoutes — catch-all not-found route', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  it('shows "Page not found" heading for an unknown path', async () => {
    await renderAtPath('/not-found');
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('shows descriptive content on the not-found page', async () => {
    await renderAtPath('/not-found');
    expect(
      screen.getByText(/check the url or head back home/i),
    ).toBeInTheDocument();
  });

  it('renders not-found page for deeply nested unknown paths', async () => {
    await renderAtPath('/some/deep/unknown/path');
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders not-found page for arbitrary unknown paths', async () => {
    await renderAtPath('/random-garbage-123');
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('does NOT show not-found page on the home route', async () => {
    await renderAtPath('/');
    expect(screen.queryByText('Page not found')).not.toBeInTheDocument();
  });
});
