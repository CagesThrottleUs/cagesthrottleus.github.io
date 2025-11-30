import type { MermaidConfig } from "mermaid";

export const URL_RESUME = "/";
export const URL_BLOG = "/blog";

/**
 * Mermaid diagram configuration
 * Cold War classified document theme
 */
export const MERMAID_CONFIG: MermaidConfig = {
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    // Cold War Classified Color Palette
    primaryColor: "#dc2626", // classified-500 red
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#dc2626",
    lineColor: "#22c55e", // terminal-500 green
    secondaryColor: "#3b82f6", // steel-500 blue
    tertiaryColor: "#f59e0b", // warning-500 amber
    background: "#0a0a0a", // dark-primary
    mainBkg: "rgba(220, 38, 38, 0.05)",
    secondBkg: "rgba(59, 130, 246, 0.05)",
    border1: "#dc2626",
    border2: "#22c55e",
    arrowheadColor: "#22c55e",
    fontFamily: "JetBrains Mono, monospace",
    fontSize: "14px",
    textColor: "#e8e8e8", // gray-200
    nodeBorder: "#dc2626",
    clusterBkg: "rgba(34, 197, 94, 0.05)",
    clusterBorder: "#22c55e",
    defaultLinkColor: "#22c55e",
    titleColor: "#ffffff",
    edgeLabelBackground: "#0a0a0a",
    nodeTextColor: "#ffffff",
    // Flowchart specific
    nodeBackground: "rgba(220, 38, 38, 0.1)",
    nodeForeground: "#ffffff",
    // Sequence diagram specific
    actorBorder: "#dc2626",
    actorBkg: "rgba(220, 38, 38, 0.1)",
    actorTextColor: "#ffffff",
    actorLineColor: "#22c55e",
    signalColor: "#e8e8e8",
    signalTextColor: "#e8e8e8",
    labelBoxBkgColor: "rgba(59, 130, 246, 0.1)",
    labelBoxBorderColor: "#3b82f6",
    labelTextColor: "#ffffff",
    // Git graph specific
    git0: "#dc2626",
    git1: "#22c55e",
    git2: "#3b82f6",
    git3: "#f59e0b",
    git4: "#60a5fa",
    git5: "#fbbf24",
    git6: "#4ade80",
    git7: "#ff3838",
    commitLabelColor: "#ffffff",
    commitLabelBackground: "rgba(220, 38, 38, 0.2)",
  },
  securityLevel: "loose",
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 15,
  },
};
