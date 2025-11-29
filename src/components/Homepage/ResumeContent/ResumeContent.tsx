import { Square, Circle } from "lucide-react";

import type {
  ResumeContentConfig,
  CompanyExperience,
  Position,
  WorkItem,
} from "./types";
import "./ResumeContent.css";

/**
 * Cold War Era Personnel Dossier - Resume Content
 * Styled as classified intelligence personnel files
 * Features typed reports, clearance stamps, and redactions
 */

/**
 * Formats a date range for classified documents
 * @param startDate - Mission start date
 * @param endDate - Mission end date (null if ongoing operation)
 * @returns Formatted string like "JUN 2024 - PRESENT"
 */
const formatDateRange = (startDate: Date, endDate: Date | null): string => {
  const start = startDate
    .toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
  const end = endDate
    ? endDate
        .toLocaleDateString("en-US", { month: "short", year: "numeric" })
        .toUpperCase()
    : "PRESENT";
  return `${start} - ${end}`;
};

interface MissionBriefingProps {
  item: WorkItem;
}

/**
 * Individual mission briefing card (work item)
 * Styled as typed intelligence report with classification markings
 */
const MissionBriefing = ({ item }: MissionBriefingProps) => {
  return (
    <div className="mission-briefing">
      <div className="briefing-header">
        <span className="classification-marking">SECRET</span>
        <span className="mission-date">
          {formatDateRange(item.startDate, item.endDate)}
        </span>
      </div>

      <div className="briefing-body">
        <div className="briefing-content">
          <div className="briefing-text">{item.description}</div>
        </div>
      </div>
    </div>
  );
};

interface AssignmentRecordProps {
  position: Position;
}

/**
 * Assignment record section (position)
 * Styled as personnel assignment documentation
 */
const AssignmentRecord = ({ position }: AssignmentRecordProps) => {
  return (
    <div className="assignment-record">
      <div className="assignment-header">
        <div className="assignment-title-block">
          <Square className="assignment-marker" size={16} fill="currentColor" />
          <h3 className="assignment-title">{position.title}</h3>
        </div>
        <span className="assignment-duration">
          {formatDateRange(position.startDate, position.endDate)}
        </span>
      </div>

      <div className="mission-briefings">
        {position.workItems.map((workItem) => (
          <MissionBriefing key={workItem.id} item={workItem} />
        ))}
      </div>
    </div>
  );
};

interface PersonnelFileProps {
  company: CompanyExperience;
}

/**
 * Personnel file section (company)
 * Styled as classified personnel dossier with file folder tab
 */
const PersonnelFile = ({ company }: PersonnelFileProps) => {
  return (
    <section className="personnel-file">
      {/* File Folder Tab */}
      <div className="file-folder-tab">
        <div className="tab-content">
          <Circle className="tab-marker" size={12} fill="currentColor" />
          <h2 className="company-name-tab">{company.company}</h2>
        </div>
        <div className="clearance-stamp">AUTHORIZED</div>
      </div>

      {/* File Content */}
      <div className="file-content">
        {/* Classification Banner */}
        <div className="file-classification-banner">
          <span className="banner-text">
            PERSONNEL FILE - {company.company.toUpperCase()}
          </span>
        </div>

        {/* Company Header with Logo */}
        <div className="company-header-section">
          <div className="company-info">
            <h1 className="company-name">{company.company}</h1>
            <div className="company-meta">
              <span className="meta-item">FILE NO: {company.id}</span>
              <span className="meta-separator">•</span>
              <span className="meta-item">CLASSIFICATION: SECRET</span>
            </div>
          </div>
          {company.logoUrl && (
            <img
              src={company.logoUrl}
              alt={`${company.company} insignia`}
              className="company-insignia"
            />
          )}
        </div>

        {/* Timeline Marker */}
        <div className="file-timeline-marker" />

        {/* All assignments for this company */}
        <div className="assignments-container">
          {company.positions.map((position) => (
            <AssignmentRecord key={position.id} position={position} />
          ))}
        </div>

        {/* File Footer */}
        <div className="file-footer">
          <span className="footer-text">
            END OF FILE - AUTHORIZED PERSONNEL ONLY
          </span>
        </div>
      </div>
    </section>
  );
};

/**
 * Main ResumeContent component
 * Displays classified personnel dossier with work history
 *
 * Structure:
 * - Personnel File (Company)
 *   - Assignment Record (Position)
 *     - Mission Briefings (Work Items)
 *
 * Features:
 * - Classified document aesthetic
 * - File folder tabs for companies
 * - Typed intelligence report style
 * - Expandable mission briefings
 * - No animations for static Cold War feel
 */
const ResumeContent = ({
  experiences,
  hoverScale = 1.05,
  animationDuration = 200,
}: ResumeContentConfig) => {
  // Sort experiences by most recent position end date
  const sortedExperiences = [...experiences].sort((a, b) => {
    const getLatestDate = (exp: CompanyExperience) => {
      const dates = exp.positions.map((pos) => pos.endDate || new Date());
      return Math.max(...dates.map((d) => d.getTime()));
    };
    return getLatestDate(b) - getLatestDate(a);
  });

  return (
    <div
      className="dossier-container"
      style={
        {
          "--hover-scale": hoverScale.toString(),
          "--animation-duration": `${animationDuration.toString()}ms`,
        } as React.CSSProperties
      }
    >
      {/* Dossier Header */}
      <div className="dossier-header">
        <h1 className="dossier-title">CLASSIFIED PERSONNEL DOSSIER</h1>
        <div className="dossier-meta">
          <span>SUBJECT: AGENT [REDACTED]</span>
          <span className="meta-separator">|</span>
          <span>CLEARANCE: TOP SECRET</span>
        </div>
      </div>

      {/* Personnel Files */}
      <div className="personnel-files">
        {sortedExperiences.map((experience) => (
          <PersonnelFile key={experience.id} company={experience} />
        ))}
      </div>

      {/* Dossier Footer */}
      <div className="dossier-footer">
        <div className="footer-stamp">CLASSIFIED</div>
        <p className="footer-warning">
          WARNING: UNAUTHORIZED ACCESS TO THIS DOSSIER IS PROHIBITED
        </p>
      </div>
    </div>
  );
};

export default ResumeContent;
