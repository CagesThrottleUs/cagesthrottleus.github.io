import '@react-spectrum/s2/page.css';

import { Provider } from '@react-spectrum/s2';
import { type NavigateOptions, useHref, useNavigate } from 'react-router';

import AppRoutes from './routes';
import { ThemeProvider } from './ThemeProvider/context';
import { useTheme } from './ThemeProvider/hooks';

declare module '@react-spectrum/s2' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

function AppInner() {
  const navigate = useNavigate();
  const { scheme } = useTheme();

  return (
    <Provider
      background="base"
      router={{
        navigate: (href, opts) => {
          void navigate(href, opts);
        },
        useHref,
      }}
      id="core-app-provider"
      colorScheme={scheme}
    >
      <AppRoutes />
    </Provider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
