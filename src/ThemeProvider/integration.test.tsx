import { act, render, screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';

import { LOCAL_STORAGE_KEY } from './constants';
import { ThemeProvider } from './context';
import { useTheme } from './hooks';

function Consumer({ id }: Readonly<{ id?: string }>) {
  const { scheme, toggleScheme } = useTheme();
  return (
    <div>
      <span data-testid={id ?? 'scheme'}>{scheme}</span>
      <button onClick={toggleScheme}>toggle</button>
    </div>
  );
}

function renderApp() {
  return render(
    <ThemeProvider>
      <Consumer />
    </ThemeProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
});

it('consumer renders initial light scheme', () => {
  renderApp();
  expect(screen.getByTestId('scheme')).toHaveTextContent('light');
});

it('consumer renders dark scheme from localStorage', () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, 'dark');
  renderApp();
  expect(screen.getByTestId('scheme')).toHaveTextContent('dark');
});

it('localStorage light wins over OS dark preference', () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, 'light');
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
  renderApp();
  expect(screen.getByTestId('scheme')).toHaveTextContent('light');
});

it('toggle updates rendered output from light to dark', () => {
  renderApp();
  expect(screen.getByTestId('scheme')).toHaveTextContent('light');
  act(() => {
    screen.getByRole('button').click();
  });
  expect(screen.getByTestId('scheme')).toHaveTextContent('dark');
});

it('toggle is reversible: light → dark → light', () => {
  renderApp();
  act(() => {
    screen.getByRole('button').click();
  });
  expect(screen.getByTestId('scheme')).toHaveTextContent('dark');
  act(() => {
    screen.getByRole('button').click();
  });
  expect(screen.getByTestId('scheme')).toHaveTextContent('light');
});

it('four sequential toggles stay consistent', () => {
  renderApp();
  const button = screen.getByRole('button');
  const label = screen.getByTestId('scheme');
  const expected = ['dark', 'light', 'dark', 'light'];
  for (const value of expected) {
    act(() => {
      button.click();
    });
    expect(label).toHaveTextContent(value);
  }
});

it('two consumers see same scheme simultaneously', () => {
  render(
    <ThemeProvider>
      <Consumer id="a" />
      <Consumer id="b" />
    </ThemeProvider>,
  );
  expect(screen.getByTestId('a')).toHaveTextContent('light');
  expect(screen.getByTestId('b')).toHaveTextContent('light');
});

it('both consumers update together on toggle', () => {
  render(
    <ThemeProvider>
      <Consumer id="a" />
      <Consumer id="b" />
    </ThemeProvider>,
  );
  act(() => {
    screen.getAllByRole('button')[0].click();
  });
  expect(screen.getByTestId('a')).toHaveTextContent('dark');
  expect(screen.getByTestId('b')).toHaveTextContent('dark');
});

it('localStorage key is exactly color-scheme', () => {
  renderApp();
  act(() => {
    screen.getByRole('button').click();
  });
  expect(localStorage.getItem('color-scheme')).toBe('dark');
  expect(localStorage.getItem('colorScheme')).toBeNull();
  expect(localStorage.getItem('theme')).toBeNull();
});

it('remount after toggle reads persisted dark from localStorage', () => {
  const { unmount } = renderApp();
  act(() => {
    screen.getByRole('button').click();
  });
  unmount();

  render(
    <ThemeProvider>
      <Consumer />
    </ThemeProvider>,
  );
  expect(screen.getByTestId('scheme')).toHaveTextContent('dark');
});
