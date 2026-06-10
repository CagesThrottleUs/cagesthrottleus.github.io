/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import macros from 'unplugin-parcel-macros';
import optimizeLocales from '@react-aria/optimize-locales-plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    macros.vite(),
    react(),
    // React Compiler adds memoization cache-check branches that V8 counts as
    // untaken when a component only renders once (cache-hit side never fires).
    // Disable during Vitest runs so branch coverage reflects application logic,
    // not compiler output. Production builds still use the compiler.
    ...(process.env.VITEST ? [] : [babel({ presets: [reactCompilerPreset()] })]),
    {
      ...optimizeLocales.vite({ locales: ['en-US'] }),
      enforce: 'pre' as const,
    },
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        // jsdom requires an http origin to enable Web Storage.
        url: 'http://localhost',
      },
    },
    server: {
      deps: {
        // Process @react-spectrum packages through Vite so raw .css imports
        // are handled by Vite's CSS pipeline instead of Node's native ESM
        // (which rejects .css file extensions).
        inline: [/@react-spectrum\//],
      },
    },
    setupFiles: ['src/test/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    coverage: {
      // V8 is the Vitest-recommended provider: native, zero-instrumentation overhead.
      // Accuracy matches Istanbul since Vitest v3.2.0. See: https://vitest.dev/guide/coverage
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/main.tsx', // entry point — no business logic
        'src/**/*.d.ts',
        '**/*.config.*',
        '**/node_modules/**',
      ],
      // text: terminal summary  json: machine-readable  html: visual browser report  lcov: CI coverage comments
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      reportOnFailure: true,
      // Industry baseline: 80% lines/functions/statements, 75% branches.
      // Branches are harder to hit (every ternary, &&, optional chain counts).
      // Source: widely adopted in React/Next.js/Express/NestJS ecosystems.
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80,
        // perFile: false — enforce globally, not per-file (per-file causes friction on thin files)
        perFile: false,
        // autoUpdate: false — thresholds must be raised deliberately, never silently
        autoUpdate: false,
      },
      // Watermarks colour the HTML report: red below low, yellow between, green above high.
      watermarks: {
        statements: [60, 80],
        functions: [60, 80],
        branches: [50, 75],
        lines: [60, 80],
      },
    },
  },
  build: {
    target: ['es2022'],
    // Lightning CSS produces a much smaller CSS bundle than the default minifier.
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        // Bundle all S2 and style-macro generated CSS into a single bundle instead of code splitting.
        // Because atomic CSS has so much overlap between components, loading all CSS up front results in
        // smaller bundles instead of producing duplication between pages.
        manualChunks(id) {
          if (
            /macro-(.*)\.css$/.test(id) ||
            /@react-spectrum\/s2\/.*\.css$/.test(id)
          ) {
            return 's2-styles';
          }
        },
      },
    },
  },
});
