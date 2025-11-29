import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { useBlogPost } from "../../hooks/useBlogPost";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import NotFoundComponent from "../NotFound/NotFound";
import { blogComponents } from "./BlogComponents";

import "./BlogPostLayout.css";

function BlogPostLayout() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { MDXContent, metadata, loading, error } = useBlogPost(slug);

  if (loading) return <LoadingSpinner />;
  if (error || !metadata || !MDXContent) return <NotFoundComponent />;

  return (
    <div className="blog-post-wrapper">
      <div className="classified-document blog-post-document">
        {/* Header */}
        <div className="document-header">
          <div className="classification-bar">{metadata.classification}</div>
          <div className="document-meta">
            <span className="doc-number">DOC-{metadata.slug}</span>
            <span className="doc-date">CLASSIFIED: {metadata.publishDate}</span>
            <span className="doc-version">VERSION: {metadata.version}</span>
          </div>
        </div>

        {/* Classified Stamp */}
        <div className="classified-stamp-container">
          <div className="classified-stamp">CLASSIFIED</div>
        </div>

        {/* Title & Abstract */}
        <h1 className="document-title">{metadata.title}</h1>

        <div className="document-abstract">
          <div className="section-header">
            <span className="section-title">EXECUTIVE SUMMARY</span>
          </div>
          <p className="abstract-text">{metadata.abstract}</p>
        </div>

        {/* Post Content */}
        <div className="blog-post-content">
          <MDXContent components={blogComponents} />
        </div>

        {/* Footer Navigation */}
        <div className="document-actions">
          <button
            className="action-btn action-btn-secondary"
            onClick={() => {
              void navigate("/blog");
            }}
            aria-label="Return to blog archive"
          >
            <ChevronLeft className="btn-marker" size={16} />
            RETURN TO ARCHIVE
          </button>
        </div>

        {/* Document Footer */}
        <div className="document-footer">
          <div className="classification-bar">{metadata.classification}</div>
          <div className="footer-warning">
            UNAUTHORIZED DISCLOSURE SUBJECT TO CRIMINAL SANCTIONS
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostLayout;
