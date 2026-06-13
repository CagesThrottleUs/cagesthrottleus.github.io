'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// Lighthouse CI configuration
//
// THRESHOLDS: all must pass. Lower a threshold only with a documented reason
// that references a specific technical impossibility — never for convenience.
//
// IGNORES: every disabled audit has an inline justification. "It's hard" is
// not acceptable. The reason must reference a structural constraint.
// ─────────────────────────────────────────────────────────────────────────────

/** @type {import('@lhci/utils/src/rc-file.js').LighthouseRcFile} */
module.exports = {
  ci: {
    collect: {
      // Start the built preview server before auditing.
      // The build step (npm run build) must have run before lhci autorun.
      startServerCommand: 'npm run preview:lhci',
      startServerReadyPattern: 'localhost:9001',
      startServerReadyTimeout: 30_000,

      // Audit the SPA entry point only.
      //
      // This app uses hash routing (/#/route). LHCI has a known bug where
      // the hash fragment is stripped from finalUrl, causing every hash-route
      // URL to report as the same origin URL — auditing /#/timeline and /
      // would produce duplicate result sets counted as 6 runs of a single
      // page, not 2×3 independent audits. Tracking issue:
      // https://github.com/GoogleChrome/lighthouse-ci/issues/797
      //
      // All routes share the same HTML/JS/CSS bundle (SPA), so performance
      // metrics are identical across routes. Accessibility for other routes
      // is covered by axe-playwright in e2e/. If per-route Lighthouse audits
      // are needed, migrate to history-API routing or add a puppeteerScript.
      url: ['http://localhost:9001/'],

      // 3 runs per URL → median is used for assertions (reduces noise).
      numberOfRuns: 3,

      settings: {
        // CI Linux runners require --no-sandbox because Chrome runs as root
        // inside the container. This flag is harmless on macOS (ignored).
        // --disable-dev-shm-usage prevents /dev/shm exhaustion on constrained
        // CI environments; has no effect locally.
        ...(process.env.CI && {
          chromeFlags: '--no-sandbox --disable-dev-shm-usage',
          chromePath: process.env.CHROME_PATH,
        }),

        // Audit as desktop — this is a content blog, not a mobile-first app.
        // Mobile audits apply 4× CPU throttling which inflates performance
        // variance; desktop gives stable, reproducible scores in CI.
        preset: 'desktop',

        // Keep page load time realistic — don't throttle the network for a
        // local preview server (no real network latency to simulate).
        throttlingMethod: 'simulate',
        throttling: {
          rttMs: 0,
          throughputKbps: 0,
          cpuSlowdownMultiplier: 1,
        },
      },
    },

    assert: {
      assertions: {
        // ── PASS THRESHOLDS ──────────────────────────────────────────────────
        // All four measured categories must clear these floors.
        // Raise, never lower, without a structural reason.

        // Performance floor is 0.70, not 0.90 — structural, not convenience.
        // This is a client-rendered React SPA: the largest-contentful-paint
        // element (the post hero image) cannot paint until the ~457 KB React
        // Spectrum S2 bundle downloads, parses, executes, and renders the DOM.
        // FCP is ~0.1s but LCP trails JS execution at ~5.7s, holding the
        // category at a stable ~0.74. Reaching 0.90 requires build-time
        // prerendering/SSR so HTML paints before JS — an architectural change
        // out of scope for a static GitHub Pages blog. Raise this floor if
        // prerendering is ever adopted.
        'categories:performance': ['error', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 1.0 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // ── EXPLICIT IGNORES ─────────────────────────────────────────────────
        // Every 'off' entry documents why the audit is structurally impossible
        // or inapplicable. Removing a justification comment is a code smell.

        // PWA SUITE — static personal blog on GitHub Pages.
        // There is no web app manifest, no service worker, and no requirement
        // for installability or offline support. All five PWA audits are
        // not applicable to this deployment target.
        'categories:pwa': 'off',
        'installable-manifest': 'off',
        'service-worker': 'off',
        'splash-screen': 'off',
        'themed-browser-ui': 'off',
        'maskable-icon': 'off',

        // HTTP/2 — vite's built-in preview server uses HTTP/1.1 on localhost.
        // Production (GitHub Pages CDN) serves HTTP/2. This cannot be
        // reproduced in the local or CI preview environment. The audit tests
        // the server protocol, not the application code.
        'uses-http2': 'off',

        // without-javascript — React SPA; the HTML shell has no server-side
        // rendered fallback. JavaScript is a hard requirement to render any
        // content. The audit is structurally not satisfiable for this stack.
        'without-javascript': 'off',
      },
    },

    upload: {
      // Save HTML + JSON reports to disk. Never push reports to an external
      // server — keeps audits hermetic and CI secrets-free.
      target: 'filesystem',
      outputDir: './lighthouse-reports',
    },
  },
};
