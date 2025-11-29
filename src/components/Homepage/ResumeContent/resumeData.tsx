import { Flex } from "@adobe/react-spectrum";
import { Text } from "react-aria-components";

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
    id: "mindgate-solutions",
    company: "Mindgate Solutions",
    logoUrl:
      "https://www.mindgate.solutions/wp-content/uploads/2024/08/mindgate-solutions-logo.png",
    positions: [
      {
        id: "software-engineer",
        title: "Software Engineer",
        startDate: new Date("2023-07-01"),
        endDate: new Date("2024-09-21"),
        workItems: [
          {
            id: "reconciliation-engine",
            startDate: new Date("2023-09-01"),
            endDate: new Date("2023-09-30"),
            description: (
              <Flex direction="column" gap="size-100">
                <Text>
                  As part of an internal assessment for selection to different
                  teams, <b>I lead a group project</b> with 6 engineers to
                  develop a <b>2-way reconciliation engine</b>.
                </Text>

                <Text>
                  This solution was end-to-end which allowed users to upload
                  data from 2 different sources NPCI and CBS. The custom code
                  validated the data and then performed a 2-way reconciliation
                  of the data then generating a final report with the
                  differences.
                </Text>

                <Text>
                  The system also managed multiple reconciliation to be done in
                  parallel along with account management. Achieved a speed of{" "}
                  <b>1000 transactions per second</b>. Used{" "}
                  <b>Spring Batch, Security, Boot, Oracle Database</b> and
                  <b> Angular</b>.
                </Text>
              </Flex>
            ),
          },
          {
            id: "monolith-to-microservices",
            startDate: new Date("2023-10-01"),
            endDate: new Date("2023-12-31"),
            description: (
              <Flex direction="column" gap="size-100">
                <Text>
                  Previous Implementation of UPI for banks such as HDFC, SBI
                  etc. had a monolithic architecture. I was part of the product
                  team responsible for rewriting and migrating the codebase to a
                  microservices architecture. I rewrote the codebase for central
                  pin management service that can be imported as a module
                  directly in - payment, pin change, pin set APIs.
                </Text>
                <Text>
                  The code rewrite was done in <b>Spring Boot</b> and{" "}
                  <b>Java</b> which reduced the codebase size from{" "}
                  <b>5000 lines</b> to <b>1000 lines</b>.
                </Text>
              </Flex>
            ),
          },
          {
            id: "fast-oc-microservice",
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-03-31"),
            description: (
              <Flex direction="column" gap="size-100">
                <Text>
                  UPI has an Operational Compliance directive for each
                  transaction. Thus for each transaction, it has to be
                  automatically understood which rules would apply and which
                  would not.
                </Text>
                <Text>
                  Once the rules are identified, the <b>previous algorithm</b>{" "}
                  would take{" "}
                  <b>
                    100ms to 500ms to complete per transaction on day with
                    average or less than average load
                  </b>{" "}
                  and <b>anywhere between 1s to 5s on day with high load</b>.
                  This is because to apply the rules, we needed last 24 hours of
                  data for each transaction.
                </Text>
                <Text>
                  I was part of team of 4 engineers who rewrote the algorithm
                  and made it a microservice that achieved <b>1ms to 2ms</b> to
                  complete per transaction on day with average or less than
                  average load and <b>100ms to 500ms</b> on day with high load.
                </Text>
                <Text>
                  This improved performance{" "}
                  <b>improve the overall transaction latency by 60%</b>. This
                  was achieved using{" "}
                  <b>Spring Boot, Aerospike Database and Java</b>. Further
                  improvements on Garbage Collection allowed us to achieve even
                  better performance.
                </Text>
              </Flex>
            ),
          },
          {
            id: "asynchronous-consumers",
            startDate: new Date("2024-04-01"),
            endDate: new Date("2024-05-15"),
            description: (
              <Flex direction="column" gap="size-100">
                <Text>
                  To achieve speed throughout the lifecycle of transaction,
                  multiple microservices used Aerospike as their database. To
                  persistently store the data, microservices were required to
                  write to DB like Oracle as well as store the changes made in
                  Aerospike.
                </Text>
                <Text>
                  Using native capability of Aerospike to post changes made to a
                  table such as insert, update, delete to a Kafka topic. I
                  developed a custom Kafka consumer to consume the changes and
                  store them in Cassandra.
                </Text>
                <Text>
                  This allowed us to achieve a speed of{" "}
                  <b>10000 transactions per second</b>. The greatest challenge
                  here to solve was to ensure both parallel processing of
                  changes and changes made to same record are not lost
                  (synchronization).
                </Text>
              </Flex>
            ),
          },
          {
            id: "change-encryption-algorithm-for-account-numbers",
            startDate: new Date("2024-05-16"),
            endDate: new Date("2024-08-31"),
            description: (
              <Flex direction="column" gap="size-100">
                <Text>
                  All Database that used to store account numbers of bank must
                  have the account numbers encrypted. As with time RBI directs
                  all banks to update the encryption algorithms within a given
                  time frame.
                </Text>
                <Text>
                  Thus the challenge here becomes that we have a source Database
                  and a target Database and we need to migrate the data from
                  source to target while changing the encryption algorithm and
                  keeping in mind both data integrity and performance while also
                  handling the various different tables that exist in the
                  database.
                </Text>
                <Text>
                  I developed a custom migration tool that receives the
                  encryption keys, algorithm and table names and then migrates
                  the data from source to target. The tool was created such that
                  it utilized restartability and idempotency to ensure that the
                  data is migrated correctly. While it was also designed to be
                  completely extensible to handle any new tables that are added
                  in the future as well as the encryption algorithm changes.
                </Text>
                <Text>
                  Tool when tested on sample data of{" "}
                  <b>30 million records took 15 minutes </b>to complete which
                  achieved a speed of <b>2 million records per minute</b>. This
                  was achieved using <b>Spring Batch and Java</b>.
                </Text>
              </Flex>
            ),
          },
        ],
      },
    ],
  },
  {
    id: "adobe-systems",
    company: "Adobe Systems India",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/90/Adobe_Corporate_wordmark.svg",
    positions: [
      {
        id: "adobe-mts-2",
        title: "Member of Technical Staff 2",
        startDate: new Date("2024-09-01"),
        endDate: null,
        workItems: [
          {
            id: "hardener-automation-tool",
            startDate: new Date("2024-10-15"),
            endDate: new Date("2024-11-01"),
            description: (
              <Flex direction="column" gap="size-100">
                <Text>
                  Started as a Software Engineer in Adobe Systems India in Cloud
                  Security Team to pump out Secure OS by default for all the
                  servers in the cloud.
                </Text>
                <Text>
                  To harden our images we use a tool called as Hardener that
                  hardens the images by applying security updates and CIS Level
                  1 Benchmarks. It also installs the several Adobe Mandated
                  packages like EDR etc.
                </Text>
                <Text>
                  The biggest challenge here is to develop hardeners for new
                  Operating Systems from scratch, even when similar OSes are
                  already supported.
                </Text>
                <Text>
                  I developed a custom <b>Python</b> automation tool that
                  reduces the time taken from <b>14 days to 3 days</b>, by
                  reducing the grunt work of implementing similar CIS Checks.
                </Text>
              </Flex>
            ),
          },
          {
            id: "flavors-automation-tool",
            startDate: new Date("2024-11-01"),
            endDate: new Date("2024-11-15"),
            description: (
              <Flex direction="column" gap="size-100">
                <Text>
                  Similar to Hardener, we also provide cloud Images directly for
                  teams to use and also give them customization options for our
                  secured OSes. A new flavor has to registered in many scattered
                  configurations.
                </Text>
                <Text>
                  The challenge comes in the total developer time taken to
                  register a new flavor in grunt work. A flavor can be easily
                  created from a similar flavor by just changing several
                  datapoints and copy several configurations and git
                  repositories.
                </Text>
                <Text>
                  Before even starting to release the new flavor and debugging
                  it a developer has to spend over 5 days just to register the
                  new flavor. For this challenge I used{" "}
                  <b>Python, Jenkinsfile</b> and <b>Groovy</b> to automate the
                  process.
                </Text>
                <Text>
                  The developed solution increased operational excellence by
                  reducing the time taken from <b>5 days to 10 minutes</b>. It
                  would do the entire process of registering a new flavor in
                  less than 10 minutes and sending an email to developers for
                  the same.
                </Text>
              </Flex>
            ),
          },
          {
            id: "vulnerability-in-base-os-images",
            startDate: new Date("2024-11-16"),
            endDate: new Date("2024-12-16"),
            description: (
              <Flex direction="column" gap="size-100">
                <Text>
                  With time we start to see vulnerabilites in our base OS
                  images. However product teams receives tickets to fix the
                  vulnerabilities in their own images which actually should be
                  fixed in the base OS images.
                </Text>
                <Text>
                  Thus as part of longer project to address this, I was part of
                  team that was responsible for providing API and WebInterface
                  to show these vulnerabilites to the teams.
                </Text>
                <Text>
                  The developed API and WebInterface allowed teams to see the
                  vulnerabilities in their own images and also provided a way
                  for product teams to understand what are their
                  responsibilities in fixing the vulnerabilities. Used Angular
                  and Java for the same.
                </Text>
              </Flex>
            ),
          },
          {
            id: "release-engineering",
            startDate: new Date("2025-01-04"),
            endDate: new Date("2025-04-01"),
            description: (
              <Flex direction="column" gap="size-100">
                <Text>
                  As part of Release Engineering team, I was responsible for
                  building a custom CI/CD pipeline for our images for all
                  flavors.
                </Text>
                <Text>
                  I spent sprints on releasing new flavors and fixing bugs in
                  the existing flavors.
                </Text>
              </Flex>
            ),
          },
          {
            id: "imagebuilder-creation",
            startDate: new Date("2025-04-01"),
            endDate: null,
            description: (
              <Flex direction="column" gap="size-100">
                <Text>
                  The previous solution to develop, distribute and manage secure
                  OS images was prone to failure and had a focus on imperative
                  over declarative definition. This reduces maintainability and
                  scalability.
                </Text>
                <Text>
                  As part of the new solution, I was responsible for developing
                  WebService/UI to manage the images and the flavors as well as
                  Distribution solution and lifecycle management solution of the
                  images.
                </Text>
                <Text>
                  The greatest challenge here was to immediately start and show
                  results to the team. Thus I used <b>React, Python, Django</b>{" "}
                  for WebService and <b>Python, Docker, Kubernetes</b> for
                  Distribution and Lifecycle management solutions.
                </Text>
                <Text>
                  Here I recieved full independence to build solutions that
                  would scale well and be easily maintainable. I received
                  valuable feedback directly from customers and teams for the
                  same.
                </Text>
              </Flex>
            ),
          },
        ],
      },
    ],
  },
];
