import type { BlogMetadata } from "../../types/blog";
import "./BlogCard.css";

interface BlogCardProps {
  metadata: BlogMetadata;
  onClick: () => void;
}

function BlogCard({ metadata, onClick }: BlogCardProps) {
  return (
    <div className="blog-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}>
      <div className="blog-card-thumbnail">
        <img
          src={`https://raw.githubusercontent.com/cagesthrottleus/cagesthrottleus.github.io/blog/${metadata.thumbnail}`}
          alt={metadata.title}
          loading="lazy"
        />
        <div className="blog-card-classification">
          {metadata.classification}
        </div>
      </div>

      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span className="blog-card-date">{metadata.publishDate}</span>
          <span className="blog-card-version">v{metadata.version}</span>
        </div>

        <h3 className="blog-card-title">{metadata.title}</h3>

        <p className="blog-card-abstract">{metadata.abstract}</p>

        <div className="blog-card-footer">
          <span className="blog-card-cta">READ BRIEFING →</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;

