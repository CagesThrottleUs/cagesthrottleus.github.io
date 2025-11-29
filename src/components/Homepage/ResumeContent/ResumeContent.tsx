import { motion, useInView } from "framer-motion";
import { Calendar, Award, Code, Zap } from "lucide-react";
import { useState , useRef } from "react";
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
 * Enhanced with animations and modern glassmorphism design
 */
const WorkItemCard = ({
  item,
  hoverScale,
  animationDuration,
  companyLogo,
  companyName,
}: WorkItemCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="work-item-wrapper no-cursor-track"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={
        {
          "--hover-scale": hoverScale.toString(),
          "--animation-duration": `${animationDuration.toString()}ms`,
        } as React.CSSProperties
      }
    >
      {/* Timeline info (appears on hover at top of card) */}
      <motion.div
        className={`timeline-info ${isHovered ? "visible" : ""}`}
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <Text className="timeline-date">
          <Calendar className="date-icon" size={12} />
          {formatDate(item.startDate)}
        </Text>
        <img
          src={companyLogo}
          alt={`${companyName} logo`}
          className="company-logo"
        />
      </motion.div>

      {/* Main card content */}
      <motion.div
        className="work-item-card"
        whileHover={{ scale: hoverScale }}
        transition={{ duration: animationDuration / 1000, ease: "easeOut" }}
      >
        {/* Gradient border effect */}
        <div className="card-gradient-border" />

        {/* Shine effect on hover */}
        <motion.div
          className="card-shine"
          animate={{ x: isHovered ? ["0%", "200%"] : "0%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        <div className="card-content">
          <div className="card-header">
            <Text className="work-date-range">
              <Calendar className="date-icon" size={14} />
              {formatDateRange(item.startDate, item.endDate)}
            </Text>
            <Zap className="achievement-icon" size={16} />
          </div>
          <div className="work-description">{item.description}</div>
        </div>
      </motion.div>
    </motion.div>
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
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={sectionRef}
      className="position-section"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6 }}
    >
      <div className="position-header">
        <Heading level={3} className="position-title">
          <Code className="position-icon" size={20} />
          {position.title}
        </Heading>
        <Text className="position-date">
          <Calendar className="date-icon" size={12} />
          {formatDateRange(position.startDate, position.endDate)}
        </Text>
      </div>

      <div className="work-items-container">
        {position.workItems.map((workItem, index) => (
          <motion.div
            key={workItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
          >
            <WorkItemCard
              item={workItem}
              hoverScale={hoverScale}
              animationDuration={animationDuration}
              companyLogo={companyLogo}
              companyName={companyName}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
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
  const companySectionRef = useRef(null);
  const isInView = useInView(companySectionRef, { once: true, amount: 0.1 });

  return (
    <motion.section
      ref={companySectionRef}
      className="company-section"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={
        isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
      }
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Company heading on background (not in card) */}
      <motion.div
        className="company-header"
        initial={{ opacity: 0, y: -20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Heading level={1} className="company-name">
          <Award className="company-icon" size={28} />
          {company.company}
        </Heading>
      </motion.div>

      {/* Timeline marker (vertical line for entire company section) */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        style={{ originY: 0 }}
      >
        <Separator orientation="vertical" className="timeline-marker" />
      </motion.div>

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
    </motion.section>
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
