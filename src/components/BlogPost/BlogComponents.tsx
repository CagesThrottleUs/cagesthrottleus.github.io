/**
 * Blog MDX Components
 *
 * Reusable components available to all blog posts.
 * These provide semantic, styled elements without requiring
 * blog authors to know CSS class names.
 */

import { ExternalLink } from "lucide-react";

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
  text: string;
  caption?: string;
}

/**
 * Mermaid diagram component
 * Links to mermaid.live with pre-populated diagram text
 *
 * Usage:
 * <Mermaid
 *   text={`
 *     flowchart TD
 *       Start --> End
 *   `}
 *   caption="Fig 1.1: System Architecture"
 * />
 */
export function Mermaid({ text, caption }: MermaidProps) {
  // Encode diagram text for URL using base64 format
  const jsonString = JSON.stringify({
    code: text.trim(),
    mermaid: { theme: "default" },
    autoSync: true,
    updateDiagram: true,
  });

  // Convert UTF-8 string to base64 safely using TextEncoder
  const bytes = new TextEncoder().encode(jsonString);
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte),
  ).join("");
  const encodedDiagram = btoa(binString);
  const mermaidUrl = `https://mermaid.live/edit#base64:${encodedDiagram}`;

  return (
    <figure className="blog-mermaid">
      <div
        style={{
          padding: "2rem",
          border: "1px solid rgba(34, 197, 94, 0.3)",
          borderRadius: "4px",
          textAlign: "center",
          background: "rgba(34, 197, 94, 0.05)",
        }}
      >
        <a
          href={mermaidUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: "#22c55e",
            color: "#0a0a0a",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            transition: "background 0.2s",
          }}
        >
          View Diagram on Mermaid.live
          <ExternalLink size={16} />
        </a>
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
  // Callout: CallOut, // Alias - MDX may normalize component names
  SectionMarker,
  ImageWithCaption,
  Highlight,
  Table,
  Mermaid,
};
