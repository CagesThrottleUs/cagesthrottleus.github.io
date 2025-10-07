import packageJson from "../../../package.json";

export const SUPPORTED_APPLICATIONS = [
  {
    name: "Resume",
    url: "/resume",
  },
  {
    name: "Projects",
    url: "/projects",
  },
  {
    name: "Blog",
    url: "/blog",
  },
];

export const APPLICATION_VERSION = packageJson.version;
