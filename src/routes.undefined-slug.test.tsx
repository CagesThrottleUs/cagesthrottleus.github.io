import { Provider } from '@react-spectrum/s2';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockMatchMedia } from './test/providers';
import { ThemeProvider } from './ThemeProvider/context';

vi.mock('./posts/promise', () => ({
  postsPromise: Promise.resolve([]),
}));

// Make useParams return undefined for slug so PostNotFound receives slug=undefined,
// covering the 'This post does not exist.' branch that is otherwise unreachable via routing.
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useParams: (): { slug: string | undefined } => ({ slug: undefined }),
  };
});

import AppRoutes from './routes';

describe('AppRoutes — PostNotFound with undefined slug', () => {
  beforeEach(() => {
    localStorage.clear();
    mockMatchMedia(false);
  });

  it('shows "This post does not exist." when slug is undefined', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/posts/no-slug']}>
          <ThemeProvider>
            <Provider background="base">
              <AppRoutes />
            </Provider>
          </ThemeProvider>
        </MemoryRouter>,
      );
      await Promise.resolve();
    });

    expect(screen.getByText('This post does not exist.')).toBeInTheDocument();
  });
});
