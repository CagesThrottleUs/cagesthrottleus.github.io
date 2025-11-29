import { describe, expect, it } from "vitest";

import App from "./App";
import { render } from "./test/testUtils";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(document.querySelector(".app-wrapper")).toBeInTheDocument();
  });

  it("renders header component", () => {
    render(<App />);
    expect(document.querySelector(".intelligence-header")).toBeInTheDocument();
    expect(document.querySelector(".agency-name")).toHaveTextContent(
      "CAGESTHROTTLEUS",
    );
  });

  it("renders footer component", () => {
    render(<App />);
    expect(document.querySelector(".classified-footer")).toBeInTheDocument();
    expect(document.querySelector(".signature-name")).toHaveTextContent(
      "CAGESTHROTTLEUS",
    );
  });

  it("renders main content area", () => {
    render(<App />);
    expect(document.querySelector(".app-content")).toBeInTheDocument();
  });

  it("includes all essential components", () => {
    render(<App />);
    expect(document.querySelector(".app-header")).toBeInTheDocument();
    expect(document.querySelector(".app-footer")).toBeInTheDocument();
    expect(
      document.querySelector(".reading-progress-container"),
    ).toBeInTheDocument();
  });
});
