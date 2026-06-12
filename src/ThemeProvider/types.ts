export type ColorScheme = 'light' | 'dark';

export interface ThemeContextValue {
  scheme: ColorScheme;
  toggleScheme: () => void;
}
