import type { CompanyExperience } from "./types";

/**
 * Resume data structured by company and position
 *
 * This file contains the actual resume content displayed on the site.
 * Structure mirrors LinkedIn's format:
 * - Company (heading on background)
 *   - Position (with date range)
 *     - Work Item Cards (specific achievements/projects with dates and JSX descriptions)
 *
 * To customize:
 * - Replace with your actual work experience
 * - Update company logos (use public URLs or local assets)
 * - Add multiple positions per company as needed
 * - Add multiple work items per position
 * - Use JSX for rich descriptions (bold, links, lists, etc.)
 */
export const resumeData: CompanyExperience[] = [
  {
    id: "tech-corp",
    company: "Tech Corp",
    logoUrl: "https://via.placeholder.com/100/0000FF/FFFFFF?text=TC",
    positions: [
      {
        id: "senior-swe",
        title: "Senior Software Engineer",
        startDate: new Date("2022-06-01"),
        endDate: null,
        workItems: [
          {
            id: "microservices",
            startDate: new Date("2022-06-01"),
            endDate: new Date("2023-03-15"),
            description: (
              <>
                Led development of{" "}
                <strong>scalable microservices architecture</strong> serving{" "}
                <strong>10M+ users</strong>. Designed and implemented
                event-driven systems using Kafka and RabbitMQ for real-time data
                processing.
              </>
            ),
          },
          {
            id: "cicd",
            startDate: new Date("2023-01-10"),
            endDate: new Date("2023-08-20"),
            description: (
              <>
                Implemented automated <strong>CI/CD pipelines</strong> using
                GitHub Actions and ArgoCD, reducing deployment time by{" "}
                <strong>60%</strong>. Introduced blue-green deployments for
                zero-downtime releases.
              </>
            ),
          },
          {
            id: "mentorship",
            startDate: new Date("2022-09-01"),
            endDate: null,
            description: (
              <>
                Mentored <strong>5 junior developers</strong> and conducted code
                reviews. Established coding standards and best practices
                documentation for the engineering team.
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "startup-inc",
    company: "StartUp Inc",
    logoUrl: "https://via.placeholder.com/100/00FF00/FFFFFF?text=SI",
    positions: [
      {
        id: "fullstack-dev",
        title: "Full Stack Developer",
        startDate: new Date("2020-03-01"),
        endDate: new Date("2022-05-31"),
        workItems: [
          {
            id: "web-apps",
            startDate: new Date("2020-03-01"),
            endDate: new Date("2021-12-31"),
            description: (
              <>
                Built responsive web applications using{" "}
                <strong>React, TypeScript, and Node.js</strong>. Implemented
                pixel-perfect UIs in collaboration with design team using Figma
                and Storybook.
              </>
            ),
          },
          {
            id: "db-optimization",
            startDate: new Date("2021-06-01"),
            endDate: new Date("2022-05-31"),
            description: (
              <>
                Optimized PostgreSQL database queries and implemented Redis
                caching, improving response time by <strong>40%</strong>.
                Designed efficient database schemas for multi-tenant
                architecture.
              </>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "digital-agency",
    company: "Digital Agency",
    logoUrl: "https://via.placeholder.com/100/FF0000/FFFFFF?text=DA",
    positions: [
      {
        id: "junior-dev",
        title: "Junior Developer",
        startDate: new Date("2018-09-01"),
        endDate: new Date("2020-02-28"),
        workItems: [
          {
            id: "client-websites",
            startDate: new Date("2018-09-01"),
            endDate: new Date("2019-12-31"),
            description: (
              <>
                Developed and maintained <strong>15+ client websites</strong>{" "}
                using modern web technologies. Ensured cross-browser
                compatibility and responsive design across all devices.
              </>
            ),
          },
          {
            id: "agile",
            startDate: new Date("2019-01-01"),
            endDate: new Date("2020-02-28"),
            description: (
              <>
                Participated in <strong>agile sprint planning</strong> and daily
                standups. Fixed bugs and implemented new features based on
                client feedback within tight deadlines.
              </>
            ),
          },
        ],
      },
    ],
  },
];
