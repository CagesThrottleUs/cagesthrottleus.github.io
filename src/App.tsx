import '@react-spectrum/s2/page.css';

import { Provider } from '@react-spectrum/s2';
import { type NavigateOptions, useHref, useNavigate } from 'react-router';

import AppRoutes from './routes';

declare module '@react-spectrum/s2' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

function AppInner() {
  const navigate = useNavigate();

  return (
    <Provider
      background="base"
      router={{
        navigate: (href, opts) => {
          void navigate(href, opts);
        },
        useHref,
      }}
    >
      <AppRoutes />
    </Provider>
  );
}

export default function App() {
  return <AppInner />;
}
