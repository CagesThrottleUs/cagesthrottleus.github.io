# CHANGELOG

## 1.2.0

- Add mobile hamburger navigation drawer — nav links hidden on mobile now accessible via slide-in panel triggered by header button
- Drawer closes on backdrop click, Escape key, or nav link click; body scroll locked while open
- Responsive side padding: `12.5vw` on desktop steps down to `6vw` on tablet and `16px` on mobile (was flat `12.5vw` at all widths)
- Add Lighthouse reporting to the project
- Drop unused `factory` field from timeline `MonthEntry` — entries now expose only the lazy `Component`; per-month dynamic loading is unchanged
- Centralise the timeline section DOM contract (`data-month-*` attributes and anchor id) in one module so sidebar navigation cannot drift from the rendered markup
- Guard post `id` against its directory name at registry load — a mismatched slug now fails loudly instead of shipping a dead "Post not found" link
- Add a meta description and `public/robots.txt` — lifts Lighthouse SEO from 0.83 to 1.0 (the SPA fallback had been serving HTML for `/robots.txt`, parsed as invalid)
- Self-host the Hello World hero image as a bundled asset instead of hot-linking Unsplash — removes the external dependency and the Lighthouse performance variance it caused
- Set the Lighthouse performance floor to 0.70 (was 0.90) with a documented structural rationale: a client-rendered S2 SPA gates LCP on bundle execution, so 0.90 is unreachable without prerendering

## 1.1.0

- Redesign site visual identity: Geist Variable font, warm editorial background (`#f8f8f7` light / `#111110` dark), amber monogram accent
- Redesign header to 3-column editorial layout — brand left, Posts/Timeline nav centre, actions right; nav collapses on mobile
- Fix post content text invisible in light mode when OS is dark (explicit `color: light-dark()` on page shell)
- Add theme colour compliance E2E tests asserting correct text and background colours in both modes
- Add nav link coverage across unit, integration, and E2E layers
- Add `/timeline` engineering activity log page with reverse-chronological month sections
- Lazy-load each month component on demand; IntersectionObserver sentinel triggers next batch
- Configurable batch size (3/6/9) via amber pill-group control
- Sticky editorial sidebar with year/month scrubber and CSS scroll-driven reading progress bar
- `CVEntry` bullet component with amber dash accent and dark frosted hover tooltip
- Seed June 2026 entries; registry auto-discovers new months via `import.meta.glob`
- Full unit, integration, and E2E test coverage for all timeline components
- Move nav links (Posts/Timeline) from header centre to header right, grouped with the theme toggle
- Move social links (GitHub, LinkedIn) from header to footer, between copyright and handle
- Add hairline vertical divider in header between nav links and theme toggle
- Scale footer social buttons down to size S to match footer's subdued detail text

## 1.0.1

- Add catch-all 404 page with React Spectrum S2 BrowserError illustration
- Expand test coverage: lazy post loading, postsPromise export, v8-ignore unreachable branches, undefined-slug PostNotFound path
- Exclude pure type declaration files from coverage reporting
- Add CHANGELOG, type-check-first CI step, Codegraph support

## 1.0.0

- Initial release of the webpage
- Add a dumb hello world blog as well
