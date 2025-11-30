import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement } from "react";
import { BrowserRouter } from "react-router";

interface AllProvidersProps {
  children: React.ReactNode;
}

// Test utility component for wrapping tests with providers
// eslint-disable-next-line react-refresh/only-export-components
function AllProviders({ children }: AllProvidersProps) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllProviders, ...options }),
  };
}

// Re-export testing library utilities alongside custom render
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { customRender as render, userEvent };
