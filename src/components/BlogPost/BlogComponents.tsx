/**
 * Blog MDX Components
 *
 * Reusable components available to all blog posts.
 * These provide semantic, styled elements without requiring
 * blog authors to know CSS class names.
 */

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

/**
 * Collection of all blog components
 * Pass this to MDXContent as the components prop
 */
export const blogComponents = {
  Redacted,
  CallOut,
  SectionMarker,
  ImageWithCaption,
  Highlight,
};
