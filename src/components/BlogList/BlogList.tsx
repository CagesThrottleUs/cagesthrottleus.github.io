import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import type { BlogMetadata } from "../../types/blog";
import { useBlogIndex } from "../../hooks/useBlogIndex";
import { useBlogPage } from "../../hooks/useBlogPage";
import BlogCard from "../BlogCard/BlogCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./BlogList.css";

function BlogList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch blog index and current page
  const { index, loading: indexLoading, error: indexError } = useBlogIndex();
  const {
    pageData,
    loading: pageLoading,
    error: pageError,
  } = useBlogPage(currentPage, !!index);

  const loading = indexLoading || pageLoading;
  const error = indexError || pageError;

  // Filter posts based on search and date filters
  const filteredPosts = useMemo(() => {
    if (!pageData) return [];

    return pageData.posts.filter((post: BlogMetadata) => {
      // Title search (case-insensitive contains)
      const matchesTitle = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Date range filter
      const postDate = new Date(post.publishDate);
      const matchesStartDate = !startDate || postDate >= new Date(startDate);
      const matchesEndDate = !endDate || postDate <= new Date(endDate);

      return matchesTitle && matchesStartDate && matchesEndDate;
    });
  }, [pageData, searchQuery, startDate, endDate]);

  if (loading && !index) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="blog-list-error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!index) {
    return <LoadingSpinner />;
  }

  return (
    <div className="blog-list-wrapper">
      <div className="classified-document blog-list-document">
        {/* Header */}
        <div className="document-header">
          <div className="classification-bar">
            INTELLIGENCE ARCHIVE // EYES ONLY
          </div>
          <div className="document-meta">
            <span className="doc-number">ARCHIVE-{new Date().getFullYear()}</span>
            <span className="doc-date">TOTAL FILES: {index.totalPosts}</span>
          </div>
        </div>

        <h1 className="document-title">CLASSIFIED BRIEFINGS</h1>

        {/* Search & Filter Section */}
        <div className="blog-filters">
          <div className="filter-group">
            <label className="filter-label" htmlFor="search-query">
              SEARCH QUERY
            </label>
            <input
              id="search-query"
              type="text"
              className="filter-input"
              placeholder="Enter keywords..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label" htmlFor="start-date">
                START DATE
              </label>
              <input
                id="start-date"
                type="date"
                className="filter-input"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                }}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label" htmlFor="end-date">
                END DATE
              </label>
              <input
                id="end-date"
                type="date"
                className="filter-input"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                }}
              />
            </div>
          </div>
        </div>

        {/* Results count */}
        {(searchQuery || startDate || endDate) && (
          <div className="filter-results">
            <span className="results-count">
              SHOWING {filteredPosts.length} OF {pageData?.posts.length || 0}{" "}
              RESULTS
            </span>
          </div>
        )}

        {/* Posts Grid */}
        {loading && pageData ? (
          <div className="blog-loading">
            <LoadingSpinner />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="blog-cards-grid">
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.slug}
                metadata={post}
                onClick={() => {
                  void navigate(`/blog/${post.slug}`);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p className="no-results-text">NO MATCHING FILES FOUND</p>
            <p className="no-results-subtext">
              Adjust your search criteria and try again
            </p>
          </div>
        )}

        {/* Pagination */}
        {index.totalPages > 1 && !searchQuery && !startDate && !endDate && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => p - 1);
              }}
              className="pagination-btn"
              aria-label="Previous page"
            >
              ◄ PREVIOUS
            </button>
            <span className="pagination-info">
              PAGE {currentPage} OF {index.totalPages}
            </span>
            <button
              disabled={currentPage === index.totalPages}
              onClick={() => {
                setCurrentPage((p) => p + 1);
              }}
              className="pagination-btn"
              aria-label="Next page"
            >
              NEXT ►
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;

