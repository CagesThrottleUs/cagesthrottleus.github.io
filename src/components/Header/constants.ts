import packageJson from "../../../package.json";
import { URL_BLOG, URL_PROJECTS, URL_RESUME } from "../../utils/constants";

export const SUPPORTED_APPLICATIONS = [
  {
    name: "Resume",
    url: URL_RESUME,
  },
  {
    name: "Projects",
    url: URL_PROJECTS,
  },
  {
    name: "Blog",
    url: URL_BLOG,
  },
];

export const APPLICATION_VERSION = packageJson.version;
