import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import {
  Redacted,
  Highlight,
  CallOut,
  SectionMarker,
  ImageWithCaption,
  Table,
  Mermaid,
} from "../BlogComponents";

// Mock mermaid
vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({
      svg: "<svg><text>Mocked Diagram</text></svg>",
    }),
    run: vi.fn().mockImplementation(() => Promise.resolve()),
  },
}));

describe("BlogComponents", () => {
  describe("Redacted", () => {
    it("should render children", () => {
      render(<Redacted>Secret Information</Redacted>);
      expect(screen.getByText("Secret Information")).toBeInTheDocument();
    });

    it("should apply redacted class", () => {
      const { container } = render(<Redacted>Secret</Redacted>);
      const span = container.querySelector(".redacted");
      expect(span).toBeInTheDocument();
    });
  });

  describe("Highlight", () => {
    it("should render children", () => {
      render(<Highlight>Important Data</Highlight>);
      expect(screen.getByText("Important Data")).toBeInTheDocument();
    });

    it("should apply blog-highlight class", () => {
      const { container } = render(<Highlight>Data</Highlight>);
      const mark = container.querySelector(".blog-highlight");
      expect(mark).toBeInTheDocument();
    });
  });

  describe("CallOut", () => {
    it("should render info callout by default", () => {
      const { container } = render(<CallOut>Info message</CallOut>);
      expect(screen.getByText("Info message")).toBeInTheDocument();
      const callout = container.querySelector(".blog-callout-info");
      expect(callout).toBeInTheDocument();
      expect(callout).toHaveClass("blog-callout");
    });

    it("should render warning callout", () => {
      const { container } = render(
        <CallOut type="warning">Warning message</CallOut>,
      );
      const callout = container.querySelector(".blog-callout-warning");
      expect(callout).toBeInTheDocument();
      expect(callout).toHaveClass("blog-callout");
    });

    it("should render error callout", () => {
      const { container } = render(
        <CallOut type="error">Error message</CallOut>,
      );
      const callout = container.querySelector(".blog-callout-error");
      expect(callout).toBeInTheDocument();
      expect(callout).toHaveClass("blog-callout");
    });

    it("should render success callout", () => {
      const { container } = render(
        <CallOut type="success">Success message</CallOut>,
      );
      const callout = container.querySelector(".blog-callout-success");
      expect(callout).toBeInTheDocument();
      expect(callout).toHaveClass("blog-callout");
    });
  });

  describe("SectionMarker", () => {
    it("should render section number and title", () => {
      render(<SectionMarker number="1.0">Mission Overview</SectionMarker>);
      expect(screen.getByText(/1\.0/)).toBeInTheDocument();
      expect(screen.getByText(/Mission Overview/i)).toBeInTheDocument();
    });

    it("should apply section-marker class", () => {
      const { container } = render(
        <SectionMarker number="2.0">Title</SectionMarker>,
      );
      const section = container.querySelector(".section-marker");
      expect(section).toBeInTheDocument();
    });
  });

  describe("ImageWithCaption", () => {
    it("should render image with caption", () => {
      render(
        <ImageWithCaption
          src="/test-image.jpg"
          caption="Test Caption"
          alt="Test Alt"
        />,
      );
      const img: HTMLImageElement = screen.getByAltText("Test Alt");
      expect(img.src).toContain("test-image.jpg");
      expect(screen.getByText("Test Caption")).toBeInTheDocument();
    });

    it("should use caption as alt text when alt is not provided", () => {
      render(<ImageWithCaption src="/test-image.jpg" caption="Test Caption" />);
      const img = screen.getByAltText("Test Caption");
      expect(img).toBeInTheDocument();
    });

    it("should apply blog-figure class", () => {
      const { container } = render(
        <ImageWithCaption src="/test.jpg" caption="Caption" />,
      );
      const figure = container.querySelector(".blog-figure");
      expect(figure).toBeInTheDocument();
    });
  });

  describe("Table", () => {
    it("should render table with headers and rows", () => {
      render(
        <Table
          headers={["Metric", "Value", "Status"]}
          rows={[
            ["Initial Load", "2 seconds", "Optimal"],
            ["Cache Hit", "87%", "Good"],
          ]}
        />,
      );

      expect(screen.getByText("Metric")).toBeInTheDocument();
      expect(screen.getByText("Value")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Initial Load")).toBeInTheDocument();
      expect(screen.getByText("2 seconds")).toBeInTheDocument();
      expect(screen.getByText("Optimal")).toBeInTheDocument();
    });

    it("should apply blog-table class", () => {
      const { container } = render(
        <Table headers={["Col1"]} rows={[["Data"]]} />,
      );
      const table = container.querySelector(".blog-table");
      expect(table).toBeInTheDocument();
    });

    it("should support JSX elements in cells", () => {
      render(
        <Table
          headers={["Metric", "Value"]}
          rows={[
            [<span key="1">Test</span>, <Highlight key="2">87%</Highlight>],
          ]}
        />,
      );

      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("87%")).toBeInTheDocument();
      const highlight = screen.getByText("87%");
      expect(highlight.tagName).toBe("MARK");
    });

    it("should render correct number of rows and columns", () => {
      const { container } = render(
        <Table
          headers={["A", "B", "C"]}
          rows={[
            ["1", "2", "3"],
            ["4", "5", "6"],
          ]}
        />,
      );

      const rows = container.querySelectorAll("tbody tr");
      expect(rows.length).toBe(2);

      const firstRowCells = rows[0].querySelectorAll("td");
      expect(firstRowCells.length).toBe(3);
    });
  });

  describe("Mermaid", () => {
    it("should render mermaid link", () => {
      const diagramCode = `
        graph TD
          A[Start] --> B[End]
      `;

      render(<Mermaid text={diagramCode} />);

      expect(
        screen.getByText("View Diagram on Mermaid.live"),
      ).toBeInTheDocument();
    });

    it("should render caption when provided", () => {
      const diagramCode = "graph TD\nA-->B";

      render(<Mermaid text={diagramCode} caption="Fig 1.1: System Flow" />);

      expect(screen.getByText("Fig 1.1: System Flow")).toBeInTheDocument();
    });

    it("should apply blog-mermaid class", () => {
      const { container } = render(<Mermaid text="graph TD\nA-->B" />);

      const figure = container.querySelector(".blog-mermaid");
      expect(figure).toBeInTheDocument();
    });

    it("should render without caption", () => {
      const { container } = render(<Mermaid text="graph TD\nA-->B" />);

      const caption = container.querySelector(".blog-caption");
      expect(caption).not.toBeInTheDocument();
    });

    it("should render link with correct href", () => {
      const diagramCode = "graph TD\nA-->B";

      render(<Mermaid text={diagramCode} />);

      const link = screen.getByText("View Diagram on Mermaid.live");
      expect(link).toHaveAttribute("href");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
