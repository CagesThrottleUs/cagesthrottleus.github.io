import { darkTheme, Provider } from "@adobe/react-spectrum";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";

import App from "./App.tsx";

import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element not found. Ensure index.html has <div id='root'></div>",
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <HashRouter>
      <div className="app text-mono text-display text">
        <Provider theme={darkTheme} id="app-provider">
          <App />
        </Provider>
      </div>
    </HashRouter>
  </StrictMode>,
);
