import { createContext } from 'react';

import type { ThemeContextValue } from './types';

export const LOCAL_STORAGE_KEY = 'color-scheme';
export const ThemeContext = createContext<ThemeContextValue | null>(null);
