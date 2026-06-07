import { Provider } from '@react-spectrum/s2';
import { type ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

import { ThemeProvider } from '../ThemeProvider/context';

export function AllProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <Provider background="base">{children}</Provider>
      </ThemeProvider>
    </MemoryRouter>
  );
}
