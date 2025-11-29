import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  Redacted,
  Highlight,
  CallOut,
  SectionMarker,
  ImageWithCaption,
} from "../BlogComponents";

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
});
