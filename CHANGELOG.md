# CHANGELOG

## 1.1.0

- Redesign site visual identity: Geist Variable font, warm editorial background (`#f8f8f7` light / `#111110` dark), amber monogram accent
- Redesign header to 3-column editorial layout — brand left, Posts/Timeline nav centre, actions right; nav collapses on mobile
- Fix post content text invisible in light mode when OS is dark (explicit `color: light-dark()` on page shell)
- Add theme colour compliance E2E tests asserting correct text and background colours in both modes
- Add nav link coverage across unit, integration, and E2E layers

## 1.0.1

- Add catch-all 404 page with React Spectrum S2 BrowserError illustration
- Expand test coverage: lazy post loading, postsPromise export, v8-ignore unreachable branches, undefined-slug PostNotFound path
- Exclude pure type declaration files from coverage reporting
- Add CHANGELOG, type-check-first CI step, Codegraph support

## 1.0.0

- Initial release of the webpage
- Add a dumb hello world blog as well
