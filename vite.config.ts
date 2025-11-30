import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate mermaid into its own chunk (loaded only when needed)
          if (id.includes("node_modules/mermaid")) {
            return "mermaid";
          }
          // Vendor chunk for React and related libraries
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router")
          ) {
            return "vendor";
          }
          // UI libraries
          if (
            id.includes("node_modules/@adobe/react-spectrum") ||
            id.includes("node_modules/react-aria-components")
          ) {
            return "ui";
          }
        },
      },
    },
    // Increase chunk size warning limit to 1000kb
    // Mermaid is large (~650kb gzipped) but lazy loaded only when diagrams are used
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/dist/**",
        "**/.{idea,git,cache,output,temp}/**",
      ],
    },
  },
});
