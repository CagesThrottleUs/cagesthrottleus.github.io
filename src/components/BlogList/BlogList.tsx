import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Input,
  Label,
  Popover,
  TextField,
} from "react-aria-components";
import { useNavigate } from "react-router";

import { useBlogIndex } from "../../hooks/useBlogIndex";
import { useBlogPage } from "../../hooks/useBlogPage";
import BlogCard from "../BlogCard/BlogCard";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import type { BlogMetadata } from "../../types/blog";
import type { DateValue } from "react-aria-components";

import "./BlogList.css";

function BlogList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<DateValue | null>(null);
  const [endDate, setEndDate] = useState<DateValue | null>(null);

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
      const matchesStartDate =
        !startDate ||
        postDate >=
          new Date(startDate.year, startDate.month - 1, startDate.day);
      const matchesEndDate =
        !endDate ||
        postDate <= new Date(endDate.year, endDate.month - 1, endDate.day);

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
            <span className="doc-number">
              ARCHIVE-{new Date().getFullYear()}
            </span>
            <span className="doc-date">TOTAL FILES: {index.totalPosts}</span>
          </div>
        </div>

        <h1 className="document-title">CLASSIFIED BRIEFINGS</h1>

        {/* Search & Filter Section */}
        <div className="blog-filters">
          <TextField
            className="filter-group"
            value={searchQuery}
            onChange={setSearchQuery}
          >
            <Label className="filter-label">SEARCH QUERY</Label>
            <Input className="filter-input" placeholder="Enter keywords..." />
          </TextField>

          <div className="filter-row">
            <DatePicker
              className="filter-group"
              value={startDate}
              onChange={setStartDate}
            >
              <Label className="filter-label">START DATE</Label>
              <Group className="date-picker-group">
                <DateInput className="filter-input date-input">
                  {(segment) => (
                    <DateSegment segment={segment} className="date-segment" />
                  )}
                </DateInput>
                <Button className="date-picker-button">
                  <CalendarIcon size={16} />
                </Button>
              </Group>
              <Popover className="date-picker-popover">
                <Dialog className="date-picker-dialog">
                  <Calendar className="date-picker-calendar">
                    <header className="calendar-header">
                      <Button slot="previous" className="calendar-nav-btn">
                        <ChevronLeft size={14} />
                      </Button>
                      <Heading className="calendar-heading" />
                      <Button slot="next" className="calendar-nav-btn">
                        <ChevronRight size={14} />
                      </Button>
                    </header>
                    <CalendarGrid className="calendar-grid">
                      {(date) => (
                        <CalendarCell date={date} className="calendar-cell" />
                      )}
                    </CalendarGrid>
                  </Calendar>
                </Dialog>
              </Popover>
            </DatePicker>

            <DatePicker
              className="filter-group"
              value={endDate}
              onChange={setEndDate}
            >
              <Label className="filter-label">END DATE</Label>
              <Group className="date-picker-group">
                <DateInput className="filter-input date-input">
                  {(segment) => (
                    <DateSegment segment={segment} className="date-segment" />
                  )}
                </DateInput>
                <Button className="date-picker-button">
                  <CalendarIcon size={16} />
                </Button>
              </Group>
              <Popover className="date-picker-popover">
                <Dialog className="date-picker-dialog">
                  <Calendar className="date-picker-calendar">
                    <header className="calendar-header">
                      <Button slot="previous" className="calendar-nav-btn">
                        <ChevronLeft size={14} />
                      </Button>
                      <Heading className="calendar-heading" />
                      <Button slot="next" className="calendar-nav-btn">
                        <ChevronRight size={14} />
                      </Button>
                    </header>
                    <CalendarGrid className="calendar-grid">
                      {(date) => (
                        <CalendarCell date={date} className="calendar-cell" />
                      )}
                    </CalendarGrid>
                  </Calendar>
                </Dialog>
              </Popover>
            </DatePicker>
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
              <ChevronLeft size={16} />
              PREVIOUS
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
              NEXT
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogList;
