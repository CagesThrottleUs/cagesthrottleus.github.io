import { type ReactNode, useCallback, useState } from 'react';

import { LOCAL_STORAGE_KEY, ThemeContext } from './constants';
import { type ColorScheme } from './types';

function initializeTheme(): ColorScheme {
  const storedScheme = localStorage.getItem(
    LOCAL_STORAGE_KEY,
  ) as ColorScheme | null;
  if (storedScheme === 'light' || storedScheme === 'dark') {
    return storedScheme;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export function ThemeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [scheme, setScheme] = useState<ColorScheme>(initializeTheme);

  const toggleScheme = useCallback(() => {
    setScheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(LOCAL_STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext value={{ scheme, toggleScheme }}>{children}</ThemeContext>
  );
}
