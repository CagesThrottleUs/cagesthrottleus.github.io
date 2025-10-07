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
      <Provider
        theme={darkTheme}
        UNSAFE_className="app text-mono"
        id="app-provider"
      >
        <App />
      </Provider>
    </HashRouter>
  </StrictMode>
);
