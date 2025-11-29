import { useState } from "react";
import { Heading, Text, Separator } from "react-aria-components";
import type {
  ResumeContentConfig,
  CompanyExperience,
  Position,
  WorkItem,
} from "./types";
import "./ResumeContent.css";

/**
 * Formats a date range for display
 * @param startDate - Start date
 * @param endDate - End date (null if current)
 * @returns Formatted string like "Jun 2024 - Present"
 */
const formatDateRange = (startDate: Date, endDate: Date | null): string => {
  const start = startDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  const end = endDate
    ? endDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Present";
  return `${start} - ${end}`;
};

/**
 * Formats a date to "Month Year" format for timeline
 * @param date - The date to format
 * @returns Formatted string like "January 2024"
 */
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

interface WorkItemCardProps {
  item: WorkItem;
  hoverScale: number;
  animationDuration: number;
  companyLogo: string;
  companyName: string;
}

/**
 * Individual work item card with hover effects
 * No cursor tracking - timeline info appears at fixed position
 */
const WorkItemCard = ({
  item,
  hoverScale,
  animationDuration,
  companyLogo,
  companyName,
}: WorkItemCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="work-item-wrapper no-cursor-track"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--hover-scale": hoverScale.toString(),
          "--animation-duration": `${animationDuration.toString()}ms`,
        } as React.CSSProperties
      }
    >
      {/* Timeline info (appears on hover at top of card) */}
      <div className={`timeline-info ${isHovered ? "visible" : ""}`}>
        <Text className="timeline-date">{formatDate(item.startDate)}</Text>
        <img
          src={companyLogo}
          alt={`${companyName} logo`}
          className="company-logo"
        />
      </div>

      {/* Main card content */}
      <div className="work-item-card">
        <Text className="work-date-range">
          {formatDateRange(item.startDate, item.endDate)}
        </Text>
        <div className="work-description">{item.description}</div>
      </div>
    </div>
  );
};

interface PositionSectionProps {
  position: Position;
  companyLogo: string;
  companyName: string;
  hoverScale: number;
  animationDuration: number;
}

/**
 * Displays a position with its work items
 */
const PositionSection = ({
  position,
  companyLogo,
  companyName,
  hoverScale,
  animationDuration,
}: PositionSectionProps) => {
  return (
    <div className="position-section">
      <div className="position-header">
        <Heading level={3} className="position-title">
          {position.title}
        </Heading>
        <Text className="position-date">
          {formatDateRange(position.startDate, position.endDate)}
        </Text>
      </div>

      <div className="work-items-container">
        {position.workItems.map((workItem) => (
          <WorkItemCard
            key={workItem.id}
            item={workItem}
            hoverScale={hoverScale}
            animationDuration={animationDuration}
            companyLogo={companyLogo}
            companyName={companyName}
          />
        ))}
      </div>
    </div>
  );
};

interface CompanySectionProps {
  company: CompanyExperience;
  hoverScale: number;
  animationDuration: number;
}

/**
 * Displays a company with all its positions
 */
const CompanySection = ({
  company,
  hoverScale,
  animationDuration,
}: CompanySectionProps) => {
  return (
    <section className="company-section">
      {/* Company heading on background (not in card) */}
      <div className="company-header">
        <Heading level={2} className="company-name">
          {company.company}
        </Heading>
      </div>

      {/* Timeline marker (vertical line for entire company section) */}
      <Separator orientation="vertical" className="timeline-marker" />

      {/* All positions for this company */}
      <div className="positions-container">
        {company.positions.map((position) => (
          <PositionSection
            key={position.id}
            position={position}
            companyLogo={company.logoUrl}
            companyName={company.company}
            hoverScale={hoverScale}
            animationDuration={animationDuration}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * Main ResumeContent component
 * Displays a LinkedIn-style timeline of work experience
 *
 * @param config - Configuration object containing experiences and display options
 *
 * Structure:
 * - Company Name (heading on background)
 *   - Position | Date Range
 *     - Work Item Cards (specific achievements)
 *
 * Features:
 * - Automatically sorts experiences by most recent position
 * - Scales cards on hover (configurable)
 * - Shows company logo and date on hover (no cursor tracking)
 * - Consistent timeline marker with light color
 */
const ResumeContent = ({
  experiences,
  hoverScale = 1.25,
  animationDuration = 300,
}: ResumeContentConfig) => {
  // Sort experiences by most recent position end date (or start date if current)
  const sortedExperiences = [...experiences].sort((a, b) => {
    const getLatestDate = (exp: CompanyExperience) => {
      const dates = exp.positions.map((pos) => pos.endDate || new Date());
      return Math.max(...dates.map((d) => d.getTime()));
    };
    return getLatestDate(b) - getLatestDate(a);
  });

  return (
    <div className="resume-content" style={{ justifySelf: "center" }}>
      {sortedExperiences.map((experience) => (
        <CompanySection
          key={experience.id}
          company={experience}
          hoverScale={hoverScale}
          animationDuration={animationDuration}
        />
      ))}
    </div>
  );
};

export default ResumeContent;
