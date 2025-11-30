/**
 * Blog MDX Components
 *
 * Reusable components available to all blog posts.
 * These provide semantic, styled elements without requiring
 * blog authors to know CSS class names.
 */

import { useEffect, useRef, useState } from "react";

import { MERMAID_CONFIG } from "../../utils/constants";

import type { ReactNode } from "react";

interface RedactedProps {
  children: ReactNode;
}

/**
 * Redacted text component
 * Displays text as classified/censored
 *
 * Usage: <Redacted>secret information</Redacted>
 */
export function Redacted({ children }: RedactedProps) {
  return <span className="redacted">{children}</span>;
}

interface CallOutProps {
  type?: "info" | "warning" | "error" | "success";
  children: ReactNode;
}

/**
 * CallOut box component
 * Highlights important information with visual emphasis
 *
 * Usage: <CallOut type="warning">Important notice</CallOut>
 */
export function CallOut({ type = "info", children }: CallOutProps) {
  return <div className={`blog-callout blog-callout-${type}`}>{children}</div>;
}

interface SectionMarkerProps {
  number: string;
  children: ReactNode;
}

/**
 * Section header with mission-style marker
 * Creates Cold War briefing style section headers
 *
 * Usage: <SectionMarker number="1.0">Mission Overview</SectionMarker>
 */
export function SectionMarker({ number, children }: SectionMarkerProps) {
  return (
    <h2 className="section-title">
      <span className="section-marker">§ {number}</span>
      {children}
    </h2>
  );
}

interface ImageWithCaptionProps {
  src: string;
  caption: string;
  alt?: string;
}

/**
 * Image with styled caption
 * Displays images with classification-style captions
 *
 * Usage: <ImageWithCaption src="/path/to/img.jpg" caption="Fig 1.1: Diagram" />
 */
export function ImageWithCaption({ src, caption, alt }: ImageWithCaptionProps) {
  return (
    <figure className="blog-figure">
      <img src={src} alt={alt || caption} />
      <figcaption className="blog-caption">{caption}</figcaption>
    </figure>
  );
}

interface HighlightProps {
  children: ReactNode;
}

/**
 * Highlighted text component
 * Emphasizes important text with terminal-style highlighting
 *
 * Usage: <Highlight>important text</Highlight>
 */
export function Highlight({ children }: HighlightProps) {
  return <mark className="blog-highlight">{children}</mark>;
}

interface TableProps {
  headers: string[];
  rows: Array<Array<ReactNode>>;
}

/**
 * Table component with classified document styling
 * Supports JSX elements in cells (unlike markdown tables)
 *
 * Usage:
 * <Table
 *   headers={['Metric', 'Value', 'Status']}
 *   rows={[
 *     ['Initial Load Time', <Highlight>&lt;2 seconds</Highlight>, '✓ Optimal'],
 *     ['Cache Hit Rate', <Highlight>87%</Highlight>, '✓ Optimal']
 *   ]}
 * />
 */
export function Table({ headers, rows }: TableProps) {
  return (
    <table className="blog-table">
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface MermaidProps {
  children: string;
  caption?: string;
}

// Track mermaid initialization globally
let mermaidInitialized = false;

/**
 * Mermaid diagram component with classified document styling
 * Renders diagrams using Cold War intelligence color palette
 * Uses safe ref-based rendering (no dangerouslySetInnerHTML)
 * Lazy loads Mermaid library only when component is used
 *
 * Usage:
 * <Mermaid caption="Fig 1.1: System Architecture">
 * {`
 * graph TD
 *   A[Client] --> B[Server]
 *   B --> C[Database]
 * `}
 * </Mermaid>
 */
export function Mermaid({ children, caption }: MermaidProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const [isRendered, setIsRendered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentRef = diagramRef.current;
    let cancelled = false;

    const loadAndRenderDiagram = async () => {
      if (!currentRef) return;

      try {
        setIsLoading(true);

        // Lazy load mermaid library (only when Mermaid component is used)
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        // Check if cancelled after async import
        if (cancelled) return;

        // Initialize mermaid once with Cold War classified theme
        if (!mermaidInitialized) {
          mermaid.initialize(MERMAID_CONFIG);
          mermaidInitialized = true;
        }

        // Clear previous content safely (use innerHTML to avoid DOM removal errors)
        currentRef.innerHTML = "";
        currentRef.removeAttribute("data-processed");

        // Create a temporary div for mermaid to process
        const tempDiv = document.createElement("div");
        tempDiv.className = "mermaid";
        tempDiv.textContent = children.trim();
        currentRef.appendChild(tempDiv);

        // Render the diagram directly into the DOM (safe approach)
        await mermaid.run({
          nodes: [tempDiv],
        });

        // Prevent state updates after unmount (cleanup can set cancelled during async)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (cancelled) return;
        setError("");
        setIsRendered(true);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to render diagram",
        );
        setIsRendered(false);
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    };

    void loadAndRenderDiagram();

    return () => {
      cancelled = true;
    };
  }, [children]);

  if (error) {
    return (
      <div className="blog-mermaid-error">
        <CallOut type="error">
          <strong>Diagram Rendering Error:</strong>
          <pre>{error}</pre>
        </CallOut>
      </div>
    );
  }

  return (
    <figure className="blog-mermaid">
      <div
        ref={diagramRef}
        className="blog-mermaid-diagram"
        style={{
          opacity: isRendered ? 1 : 0,
          transition: "opacity 0.3s",
          minHeight: isLoading ? "200px" : undefined,
        }}
      >
        {isLoading && (
          <div
            style={{ textAlign: "center", padding: "3rem", color: "#22c55e" }}
          >
            Loading diagram renderer...
          </div>
        )}
      </div>
      {caption && <figcaption className="blog-caption">{caption}</figcaption>}
    </figure>
  );
}

/**
 * Collection of all blog components
 * Pass this to MDXContent as the components prop
 */
// eslint-disable-next-line react-refresh/only-export-components
export const blogComponents = {
  Redacted,
  CallOut,
  SectionMarker,
  ImageWithCaption,
  Highlight,
  Table,
  Mermaid,
};
