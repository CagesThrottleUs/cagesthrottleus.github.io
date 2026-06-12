# Testing Guide

This project uses a three-layer testing strategy: unit/component tests via Vitest + React Testing Library, and end-to-end + accessibility tests via Playwright + axe-core.

---

## Table of Contents

1. [Stack](#1-stack)
2. [Running Tests](#2-running-tests)
3. [Unit Tests](#3-unit-tests)
4. [Component Tests](#4-component-tests)
5. [Integration Tests](#5-integration-tests)
6. [E2E Tests](#6-e2e-tests)
7. [Accessibility Tests](#7-accessibility-tests)
8. [React Spectrum S2 Specifics](#8-react-spectrum-s2-specifics)
9. [Test Behavior Guidelines](#9-test-behavior-guidelines)
10. [Coverage](#10-coverage)

---

## 1. Stack

| Layer             | Tool                                                                                   | Purpose                                  |
| ----------------- | -------------------------------------------------------------------------------------- | ---------------------------------------- |
| Unit / Component  | [Vitest](https://vitest.dev)                                                           | Fast, Vite-native test runner            |
| DOM rendering     | [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Renders components; queries by semantics |
| User interactions | [@testing-library/user-event](https://testing-library.com/docs/user-event/intro)       | Realistic browser event simulation       |
| DOM matchers      | [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)               | `toBeInTheDocument`, `toHaveRole`, etc.  |
| E2E               | [Playwright](https://playwright.dev)                                                   | Real browser automation                  |
| Accessibility     | [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)                      | WCAG audit wired into Playwright         |

Vitest is configured inside `vite.config.ts` — it inherits all plugins (React Compiler, locale optimizer, macros) automatically. No separate config file needed.

---

## 2. Running Tests

```bash
# Unit/component tests — watch mode (dev)
npm test

# Unit/component tests — single run (CI)
npm run test:run

# Unit/component tests with coverage report
npm run test:coverage

# Vitest browser UI (visual test explorer)
npm run test:ui

# E2E tests (headless)
npm run test:e2e

# E2E tests with Playwright UI (visual debugger)
npm run test:e2e:ui
```

Coverage HTML report is written to `./coverage/index.html` after `test:coverage`.

---

## 3. Unit Tests

Unit tests cover pure logic: hooks, utilities, and context values — no DOM rendering.

**File location:** co-locate with the source file.

```
src/context/theme.tsx
src/context/theme.test.ts   ← lives next to the source
```

### When to write a unit test

- Custom hooks (`useTheme`, `useLocalStorage`, etc.)
- Pure utility functions (formatters, validators, parsers)
- Context initial values and reducer logic

### Template

```ts
// src/context/theme.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTheme } from './theme';

describe('useTheme', () => {
  it('initializes to light', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.colorScheme).toBe('light');
  });

  it('toggles to dark and back', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.toggle());
    expect(result.current.colorScheme).toBe('dark');

    act(() => result.current.toggle());
    expect(result.current.colorScheme).toBe('light');
  });
});
```

### Rules

- One `describe` block per module.
- Test the **public API** of the hook, not its internals.
- Use `act()` for every state update.
- Never mock what you are testing.

---

## 4. Component Tests

Component tests render a single component and assert on what a user sees and can do.

**File location:** co-located with the component.

```
src/components/Layout.tsx
src/components/Layout.test.tsx
```

### Setup: custom render helper

Create `src/test/render.tsx` to wrap components with all required providers:

```tsx
// src/test/render.tsx
import { render, type RenderOptions } from '@testing-library/react';
import { HashRouter } from 'react-router';
import { Provider } from '@react-spectrum/s2';
import type { ReactElement } from 'react';

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider background="base" colorScheme="light">
      <HashRouter>{children}</HashRouter>
    </Provider>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: Wrapper, ...options });
}
```

Always use `renderWithProviders` instead of bare `render` for components that use React Spectrum or routing.

### Template

```tsx
// src/components/Layout.test.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Layout } from './Layout';
import { renderWithProviders } from '../test/render';

describe('Layout', () => {
  it('renders the blog title', () => {
    renderWithProviders(
      <Layout>
        <p>content</p>
      </Layout>,
    );
    expect(screen.getByRole('banner')).toHaveTextContent('cagesthrottleus');
  });

  it('renders children in main', () => {
    renderWithProviders(
      <Layout>
        <p>hello</p>
      </Layout>,
    );
    expect(screen.getByRole('main')).toHaveTextContent('hello');
  });

  it('toggles color scheme on button click', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Layout>
        <p>content</p>
      </Layout>,
    );

    const toggle = screen.getByRole('button', { name: /toggle.*theme/i });
    await user.click(toggle);
    // assert the observable result, not the internal state
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });
});
```

### Query priority (highest to lowest)

Use queries in this order — earlier ones are more resilient:

| Priority | Query                  | Use when                                       |
| -------- | ---------------------- | ---------------------------------------------- |
| 1        | `getByRole`            | Always try this first — matches ARIA semantics |
| 2        | `getByLabelText`       | Form controls                                  |
| 3        | `getByPlaceholderText` | Inputs with placeholder only                   |
| 4        | `getByText`            | Non-interactive text nodes                     |
| 5        | `getByTestId`          | Last resort — add `data-testid` to the element |

**Never** query by class name, CSS selector, or DOM structure. Those are implementation details — they break when you restyle.

### Async assertions

```tsx
// Wait for async renders (lazy imports, Suspense, promises)
import { waitFor } from '@testing-library/react';

it('shows post after load', async () => {
  renderWithProviders(<PostPage slug="hello" />);
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: 'Hello' })).toBeInTheDocument();
  });
});

// Or use findBy* which is waitFor + getBy combined
it('shows post after load', async () => {
  renderWithProviders(<PostPage slug="hello" />);
  expect(
    await screen.findByRole('heading', { name: 'Hello' }),
  ).toBeInTheDocument();
});
```

### What NOT to test in component tests

- Internal state variables
- Private helper functions
- Exact DOM structure (tag names, nesting)
- Styling / CSS class names
- That a child component was called with specific props (use integration for that)

---

## 5. Integration Tests

Integration tests exercise multiple components together across a route or feature boundary.

**File location:** `src/test/integration/`

### What they cover

- Route renders the correct page component
- Navigation between routes works correctly
- Context state (theme, auth) persists across route changes
- Suspense fallback renders then resolves

### Template: route-level integration

```tsx
// src/test/integration/routing.test.tsx
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { HashRouter } from 'react-router';
import { Provider } from '@react-spectrum/s2';
import App from '../../App';

function renderApp() {
  return render(
    <Provider background="base">
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>,
  );
}

describe('routing', () => {
  it('renders home at /', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });
});
```

> **HashRouter note:** In tests, the URL is controlled by the `MemoryRouter` variant when you need to start at a specific path. For most integration tests, `HashRouter` is fine because the initial route is always `/`.

### Template: starting at a specific route

```tsx
import { MemoryRouter } from 'react-router';

function renderAt(path: string) {
  return render(
    <Provider background="base">
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </Provider>,
  );
}

it('renders post page for /post/hello', async () => {
  renderAt('/post/hello');
  await waitFor(() => {
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```

---

## 6. E2E Tests

E2E tests run in a real browser against the deployed app (or a local `vite preview` server).

**File location:** `e2e/` at the project root.

### Playwright config

Create `playwright.config.ts` at the root:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: 'html',
  use: {
    // Point at vite preview during CI; use dev server locally
    baseURL: process.env['BASE_URL'] ?? 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env['CI'],
  },
});
```

### HashRouter navigation

This site uses `HashRouter`, so all routes are prefixed with `#`. Use `page.goto('/#/post/hello')` not `page.goto('/post/hello')`.

```ts
// e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test('home page renders blog title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
});

test('navigates to a post via hash route', async ({ page }) => {
  await page.goto('/#/post/hello-world');
  await expect(page.getByRole('main')).toBeVisible();
});
```

### Interaction patterns

```ts
// Click
await page.getByRole('button', { name: /toggle theme/i }).click();

// Type into input
await page.getByRole('searchbox').fill('my query');

// Keyboard navigation
await page.keyboard.press('Tab');
await page.keyboard.press('Enter');

// Wait for async content
await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
```

### Locator priority (mirrors RTL)

1. `getByRole` — most stable; matches ARIA semantics
2. `getByLabel` — form inputs
3. `getByText` — visible text
4. `getByTestId` — last resort (`data-testid`)

**Never** use CSS selectors or XPath in E2E tests. They are brittle and test implementation, not behavior.

---

## 7. Accessibility Tests

Accessibility tests run axe-core inside Playwright against real rendered pages. They catch ~57% of WCAG violations automatically ([Deque Systems](https://www.deque.com)).

### Install

Already installed: `@axe-core/playwright`.

### WCAG levels

| Tag        | Standard                                                    |
| ---------- | ----------------------------------------------------------- |
| `wcag2a`   | WCAG 2.0 Level A (minimum)                                  |
| `wcag2aa`  | WCAG 2.0 Level AA (legal requirement in most jurisdictions) |
| `wcag21a`  | WCAG 2.1 Level A                                            |
| `wcag21aa` | WCAG 2.1 Level AA (recommended target)                      |
| `wcag22aa` | WCAG 2.2 Level AA (EU directive requirement)                |

### Basic page scan

```ts
// e2e/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accessibility', () => {
  test('home page passes WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('post page passes WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/#/post/hello-world');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

### Scan within a region

Only scan a specific component — useful when testing a newly added widget:

```ts
const results = await new AxeBuilder({ page })
  .include('#main-content')
  .withTags(['wcag2a', 'wcag2aa'])
  .analyze();
```

### Excluding known issues with justification

If a third-party component has a known unfixed violation, exclude it with a documented reason:

```ts
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  // React Spectrum DatePicker role="group" labelling — tracked in adobe/react-spectrum#XXXX
  .exclude('.react-spectrum-DatePicker-dialog')
  .analyze();
```

> **Rule:** every exclusion needs a code comment citing the upstream issue. No silent suppressions.

### Keyboard navigation test

Automated axe scans do not test keyboard focus order. Write explicit keyboard tests:

```ts
test('keyboard: can reach and activate theme toggle', async ({ page }) => {
  await page.goto('/');

  // Tab from the top until we reach the toggle button
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const focused = page.locator(':focus');
  await expect(focused).toHaveAttribute('aria-label', /toggle.*theme/i);

  await page.keyboard.press('Enter');
  await expect(focused).toHaveAttribute('aria-pressed', 'true');
});
```

### Color contrast

axe-core catches contrast failures at level AA (`color-contrast` rule). To also catch APCA (advanced perceptual contrast), run Lighthouse separately via `npx playwright-lighthouse`.

---

## 8. React Spectrum S2 Specifics

React Spectrum S2 components implement ARIA patterns precisely. This makes testing straightforward — query by the ARIA role the component exposes.

### Common role mappings

| S2 Component     | ARIA role             | Example query                              |
| ---------------- | --------------------- | ------------------------------------------ |
| `Button`         | `button`              | `getByRole('button', { name: '...' })`     |
| `Link`           | `link`                | `getByRole('link', { name: '...' })`       |
| `TextField`      | `textbox`             | `getByRole('textbox', { name: 'Label' })`  |
| `Checkbox`       | `checkbox`            | `getByRole('checkbox', { name: 'Label' })` |
| `Switch`         | `switch`              | `getByRole('switch', { name: 'Label' })`   |
| `Slider`         | `slider`              | `getByRole('slider', { name: 'Label' })`   |
| `Dialog`         | `dialog`              | `getByRole('dialog')`                      |
| `Menu`           | `menu`                | `getByRole('menu')`                        |
| `MenuItem`       | `menuitem`            | `getByRole('menuitem', { name: '...' })`   |
| `ProgressCircle` | `progressbar`         | `getByRole('progressbar')`                 |
| `Provider`       | (none — wrapper only) | assert children                            |

### Fake timers

React Spectrum uses timers for animations and hover/press delays. Without fake timers, `waitFor` calls can time out or leave pending timers that pollute other tests.

```tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('component with overlays', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('opens menu on click', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(<MyMenuButton />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    vi.runAllTimers();

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});
```

Note the `advanceTimers` option passed to `userEvent.setup()` — this keeps userEvent's internal timers in sync with Vitest's fake timer clock.

### ProgressCircle / loading states

The `ProgressCircle` used as a Suspense fallback renders with `role="progressbar"`:

```tsx
// Assert the loading state appears then resolves
it('shows loading fallback then content', async () => {
  renderWithProviders(<AppRoutes />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
```

### Provider in tests

Always wrap with `<Provider>` when testing S2 components — without it, styling and aria context are missing and tests will produce false results:

```tsx
// ✅ correct
render(
  <Provider background="base">
    <Button>Save</Button>
  </Provider>,
);

// ❌ wrong — S2 Provider context missing
render(<Button>Save</Button>);
```

Use the `renderWithProviders` helper from `src/test/render.tsx` to avoid repeating this.

---

## 9. Test Behavior Guidelines

### Arrange – Act – Assert

Every test follows the AAA pattern:

```ts
it('description of observable behavior', async () => {
  // Arrange: set up the component and any prerequisites
  renderWithProviders(<Layout><p>content</p></Layout>);

  // Act: perform the user action
  await user.click(screen.getByRole('button', { name: /toggle theme/i }));

  // Assert: check what the user can observe
  expect(screen.getByRole('button', { name: /toggle theme/i }))
    .toHaveAttribute('aria-pressed', 'true');
});
```

### What to test

| Test                                      | Test it | Don't test it                                           |
| ----------------------------------------- | ------- | ------------------------------------------------------- |
| A button click changes visible state      | ✅      | The internal `useState` value                           |
| A form submits correct data               | ✅      | That `onSubmit` prop was called with exact object shape |
| A loading spinner appears then disappears | ✅      | That `isLoading` is `true` at a specific point          |
| A11y: heading hierarchy                   | ✅      | That `<h1>` has class `title`                           |
| Error boundary shows fallback             | ✅      | Which line of code threw                                |

### Test naming

Use `it('verb + what the user observes')` format:

```ts
// ✅ good — describes observable behavior
it('shows version badge in the footer');
it('navigates to post page on title click');
it('disables submit button while form is invalid');

// ❌ bad — describes implementation
it('calls navigate() with correct arguments');
it('sets isOpen to true');
it('renders PostPage component');
```

### One assertion per behavior

Group related assertions in one test. Do not write one assertion per test — that produces noise, not signal:

```ts
// ✅ one test, one behavior (multiple assertions are fine)
it('renders footer with version and GitHub link', () => {
  renderWithProviders(<Layout><p /></Layout>);
  const footer = screen.getByRole('contentinfo');
  expect(footer).toHaveTextContent(/v\d+\.\d+\.\d+/);
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
    'href',
    'https://github.com/CagesThrottleUs',
  );
});

// ❌ two tests for the same behavior — over-isolated
it('renders version') ...
it('renders github link') ...
```

### Mocking

- **Never mock your own modules** in unit or component tests. If you feel the urge, the component has a hidden dependency that should be made explicit.
- **Mock at boundaries**: network calls (`fetch`, `XMLHttpRequest`), browser APIs (`localStorage`, `matchMedia`), and timers.
- Use `vi.stubGlobal` for browser globals, not direct assignment.

```ts
beforeEach(() => {
  vi.stubGlobal('localStorage', {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
```

---

## 10. Coverage

Coverage is measured with V8 (native, zero-instrumentation overhead).

Run `npm run test:coverage` then open `coverage/index.html`.

### Thresholds (enforced in CI)

| Metric     | Minimum |
| ---------- | ------- |
| Statements | 80%     |
| Branches   | 75%     |
| Functions  | 80%     |
| Lines      | 80%     |

These are baselines. Raise them as the project grows — the goal is 90%+ for business logic paths.

### What coverage does NOT tell you

High coverage does not mean high quality. A test that renders a component and asserts nothing will add coverage without adding safety. Always write meaningful assertions — the goal is confidence that the feature works, not a coverage number.

---

## Sources

- [Vitest – Getting Started](https://vitest.dev/guide/)
- [Vitest – Config Reference](https://vitest.dev/config/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Spectrum – Testing](https://react-spectrum.adobe.com/testing)
- [Playwright – Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [axe-playwright on npm](https://www.npmjs.com/package/axe-playwright)
- [Testing Library – ByRole query](https://testing-library.com/docs/queries/byrole/)
- [Best Practices for React UI Testing 2026](https://trio.dev/best-practices-for-react-ui-testing/)
