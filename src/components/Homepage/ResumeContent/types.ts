/**
 * Represents a specific work achievement or project within a position
 */
export interface WorkItem {
  /** Unique identifier for the work item */
  id: string;
  /** Start date of this work item */
  startDate: Date;
  /** End date of this work item (null if ongoing) */
  endDate: Date | null;
  /** Detailed description as JSX element */
  description: React.ReactNode;
}

/**
 * Represents a position held at a company
 */
export interface Position {
  /** Unique identifier for the position */
  id: string;
  /** Job title or role */
  title: string;
  /** Start date of the position */
  startDate: Date;
  /** End date of the position (null if current) */
  endDate: Date | null;
  /** Array of work items/achievements for this position */
  workItems: WorkItem[];
}

/**
 * Represents a company with all positions held there
 */
export interface CompanyExperience {
  /** Unique identifier for the company */
  id: string;
  /** Company or organization name */
  company: string;
  /** URL to company logo image */
  logoUrl: string;
  /** Array of positions held at this company */
  positions: Position[];
}

/**
 * Configuration for the ResumeContent component
 */
export interface ResumeContentConfig {
  /** Array of company experiences to display */
  experiences: CompanyExperience[];
  /** Scale factor on hover (default: 1.25 for 125%) */
  hoverScale?: number;
  /** Animation duration in milliseconds (default: 300ms) */
  animationDuration?: number;
}
