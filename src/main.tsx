import { darkTheme, Provider } from "@adobe/react-spectrum";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";

import App from "./App.tsx";

import "./index.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <div className="app text-mono text-display text">
        <Provider
          theme={darkTheme}
          id="app-provider"
        >
          <App />
        </Provider>
      </div>
    </HashRouter>
  </StrictMode>
);
