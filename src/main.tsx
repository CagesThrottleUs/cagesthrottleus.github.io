import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { darkTheme, Provider } from "@adobe/react-spectrum";
import { HashRouter } from "react-router";

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
