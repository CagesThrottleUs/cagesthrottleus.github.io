import packageJson from "../../../package.json";
import { URL_BLOG, URL_RESUME } from "../../utils/constants";

export const SUPPORTED_APPLICATIONS = [
  {
    name: "Resume",
    url: URL_RESUME,
  },
  {
    name: "Blog",
    url: URL_BLOG,
  },
];

export const APPLICATION_VERSION = packageJson.version;
