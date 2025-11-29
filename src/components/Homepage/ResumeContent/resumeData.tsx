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
                  teams, <b>I lead a group project</b> with <b>6 engineers</b>{" "}
                  to develop a <b>2-way reconciliation engine</b>.
                </Text>

                <Text>
                  This solution was <b>end-to-end</b> which allowed users to
                  upload data from <b>2 different sources</b> <b>NPCI</b> and{" "}
                  <b>CBS</b>. The custom code validated the data and then
                  performed a <b>2-way reconciliation</b>
                  of the data then generating a final report with the
                  differences.
                </Text>

                <Text>
                  The system also managed <b>multiple reconciliation</b> to be
                  done in parallel along with <b>account management</b>.
                  Achieved a speed of <b>1000 transactions per second</b>. Used{" "}
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
                  Previous Implementation of <b>UPI</b> for banks such as{" "}
                  <b>HDFC, SBI</b>
                  etc. had a <b>monolithic architecture</b>. I was part of the
                  product team responsible for <b>rewriting and migrating</b>{" "}
                  the codebase to a<b> microservices architecture</b>. I rewrote
                  the codebase for <b>central pin management service</b> that
                  can be imported as a module directly in -{" "}
                  <b>payment, pin change, pin set APIs</b>.
                </Text>
                <Text>
                  The code rewrite was done in <b>Spring Boot</b> and{" "}
                  <b>Java</b> which reduced the codebase size from{" "}
                  <b>5000 lines</b> to <b>1000 lines</b> (<b>80% reduction</b>).
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
                  <b>UPI</b> has an <b>Operational Compliance</b> directive for
                  each transaction. Thus for each transaction, it has to be
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
                  This is because to apply the rules, we needed{" "}
                  <b>last 24 hours</b> of data for each transaction.
                </Text>
                <Text>
                  I was part of team of <b>4 engineers</b> who{" "}
                  <b>rewrote the algorithm</b>
                  and made it a <b>microservice</b> that achieved{" "}
                  <b>1ms to 2ms</b> to complete per transaction on day with
                  average or less than average load and <b>100ms to 500ms</b> on
                  day with high load.
                </Text>
                <Text>
                  This improved performance{" "}
                  <b>improve the overall transaction latency by 60%</b>. This
                  was achieved using{" "}
                  <b>Spring Boot, Aerospike Database and Java</b>. Further
                  improvements on <b>Garbage Collection</b> allowed us to
                  achieve even better performance.
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
                  multiple microservices used <b>Aerospike</b> as their
                  database. To persistently store the data, microservices were
                  required to write to DB like <b>Oracle</b> as well as store
                  the changes made in Aerospike.
                </Text>
                <Text>
                  Using native capability of <b>Aerospike</b> to post changes
                  made to a table such as <b>insert, update, delete</b> to a{" "}
                  <b>Kafka topic</b>. I developed a <b>custom Kafka consumer</b>{" "}
                  to consume the changes and store them in <b>Cassandra</b>.
                </Text>
                <Text>
                  This allowed us to achieve a speed of{" "}
                  <b>10000 transactions per second</b>. The greatest challenge
                  here to solve was to ensure both <b>parallel processing</b> of
                  changes and changes made to same record are not lost (
                  <b>synchronization</b>).
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
                  All Database that used to store <b>account numbers</b> of bank
                  must have the account numbers <b>encrypted</b>. As with time{" "}
                  <b>RBI</b> directs all banks to update the{" "}
                  <b>encryption algorithms</b> within a given time frame.
                </Text>
                <Text>
                  Thus the challenge here becomes that we have a{" "}
                  <b>source Database</b>
                  and a <b>target Database</b> and we need to migrate the data
                  from source to target while{" "}
                  <b>changing the encryption algorithm</b> and keeping in mind
                  both <b>data integrity</b> and <b>performance</b> while also
                  handling the various different tables that exist in the
                  database.
                </Text>
                <Text>
                  I developed a <b>custom migration tool</b> that receives the
                  encryption keys, algorithm and table names and then migrates
                  the data from source to target. The tool was created such that
                  it utilized <b>restartability</b> and <b>idempotency</b> to
                  ensure that the data is migrated correctly. While it was also
                  designed to be completely <b>extensible</b> to handle any new
                  tables that are added in the future as well as the encryption
                  algorithm changes.
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
                  Started as a <b>Software Engineer</b> in{" "}
                  <b>Adobe Systems India</b> in <b>Cloud Security Team</b> to
                  pump out <b>Secure OS</b> by default for all the servers in
                  the cloud.
                </Text>
                <Text>
                  To harden our images we use a tool called as <b>Hardener</b>{" "}
                  that hardens the images by applying <b>security updates</b>{" "}
                  and <b>CIS Level 1 Benchmarks</b>. It also installs the
                  several <b>Adobe Mandated packages</b> like <b>EDR</b> etc.
                </Text>
                <Text>
                  The biggest challenge here is to develop hardeners for{" "}
                  <b>new Operating Systems from scratch</b>, even when similar
                  OSes are already supported.
                </Text>
                <Text>
                  I developed a custom <b>Python</b> automation tool that
                  reduces the time taken from <b>14 days to 3 days</b> (
                  <b>78% reduction</b>), by reducing the grunt work of
                  implementing similar <b>CIS Checks</b>.
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
                  Similar to <b>Hardener</b>, we also provide{" "}
                  <b>cloud Images</b> directly for teams to use and also give
                  them <b>customization options</b> for our secured OSes. A{" "}
                  <b>new flavor</b> has to registered in many scattered
                  configurations.
                </Text>
                <Text>
                  The challenge comes in the total <b>developer time</b> taken
                  to register a new flavor in <b>grunt work</b>. A flavor can be
                  easily created from a similar flavor by just changing several
                  datapoints and copy several <b>configurations</b> and{" "}
                  <b>git repositories</b>.
                </Text>
                <Text>
                  Before even starting to release the new flavor and debugging
                  it a developer has to spend over <b>5 days</b> just to
                  register the new flavor. For this challenge I used{" "}
                  <b>Python, Jenkinsfile</b> and <b>Groovy</b> to automate the
                  process.
                </Text>
                <Text>
                  The developed solution increased <b>operational excellence</b>{" "}
                  by reducing the time taken from <b>5 days to 10 minutes</b> (
                  <b>99.86% reduction</b>). It would do the entire process of
                  registering a new flavor in less than <b>10 minutes</b> and
                  sending an <b>email</b> to developers for the same.
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
                  With time we start to see <b>vulnerabilites</b> in our{" "}
                  <b>base OS images</b>. However product teams receives tickets
                  to fix the vulnerabilities in their own images which actually
                  should be fixed in the base OS images.
                </Text>
                <Text>
                  Thus as part of longer project to address this, I was part of
                  team that was responsible for providing <b>API</b> and{" "}
                  <b>WebInterface</b>
                  to show these vulnerabilites to the teams.
                </Text>
                <Text>
                  The developed <b>API and WebInterface</b> allowed teams to see
                  the vulnerabilities in their own images and also provided a
                  way for product teams to understand what are their
                  responsibilities in fixing the vulnerabilities. Used{" "}
                  <b>Angular</b>
                  and <b>Java</b> for the same.
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
                  As part of <b>Release Engineering team</b>, I was responsible
                  for building a <b>custom CI/CD pipeline</b> for our images for
                  all flavors.
                </Text>
                <Text>
                  I spent sprints on <b>releasing new flavors</b> and{" "}
                  <b>fixing bugs</b> in the existing flavors. I managed{" "}
                  <b>60+ flavors</b>, with a near{" "}
                  <b>95% success rate on delivery of all flavors</b>.
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
                  The previous solution to <b>develop, distribute and manage</b>{" "}
                  secure OS images was prone to failure and had a focus on{" "}
                  <b>imperative over declarative</b> definition. This reduces{" "}
                  <b>maintainability</b> and
                  <b> scalability</b>.
                </Text>
                <Text>
                  As part of the <b>new solution</b>, I was responsible for
                  developing
                  <b> WebService/UI</b> to manage the images and the flavors as
                  well as
                  <b> Distribution solution</b> and{" "}
                  <b>lifecycle management solution</b> of the images.
                </Text>
                <Text>
                  The greatest challenge here was to immediately start and show
                  results to the team. Thus I used <b>React, Python, Django</b>{" "}
                  for WebService and <b>Python, Docker, Kubernetes</b> for
                  Distribution and Lifecycle management solutions.
                </Text>
                <Text>
                  Here I recieved <b>full independence</b> to build solutions
                  that would scale well and be easily maintainable. I received
                  <b> valuable feedback directly from customers</b> and teams
                  for the same.
                </Text>
                {/* TODO: Add metrics - number of teams using, deployment frequency, system uptime */}
                <Text>
                  Currently <b>10k instances</b> are online on the new images
                  built from this platform. With over <b>5 teams</b> onboarded
                  to use the new platform.
                </Text>
              </Flex>
            ),
          },
        ],
      },
    ],
  },
];
