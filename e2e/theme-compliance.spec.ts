import { expect, type Page, test } from '@playwright/test';

const POST_URL = '/#/posts/2026-06-08-hello-world';

// Retrieves a computed CSS property value from a DOM element.
async function computedStyle(
  page: Page,
  selector: string,
  property: string,
): Promise<string | null> {
  return page.evaluate(
    ({ sel, prop }: { sel: string; prop: string }) => {
      const el = document.querySelector(sel);
      return el
        ? window.getComputedStyle(el).getPropertyValue(prop).trim()
        : null;
    },
    { sel: selector, prop: property },
  );
}

test.describe('post content — theme color compliance', () => {
  test.beforeEach(async ({ page }) => {
    // Force light theme so every test starts from a known state.
    await page.goto(POST_URL);
    await page.evaluate(() => localStorage.setItem('color-scheme', 'light'));
    await page.reload();
    await page
      .getByRole('button', { name: /back to home/i })
      .waitFor({ state: 'visible', timeout: 10_000 });
  });

  // ── light mode ──────────────────────────────────────────────────────────────

  test('post paragraph text is dark in light mode', async ({ page }) => {
    const color = await computedStyle(page, 'article p', 'color');
    // #1c1917 = rgb(28, 25, 23) — dark stone; readable on #f8f8f7 background
    expect(color).toBe('rgb(28, 25, 23)');
  });

  test('post heading text is dark in light mode', async ({ page }) => {
    const color = await computedStyle(page, 'article h1', 'color');
    expect(color).toBe('rgb(28, 25, 23)');
  });

  test('page shell background is light in light mode', async ({ page }) => {
    const bg = await computedStyle(
      page,
      '#common-style-div',
      'background-color',
    );
    // #f8f8f7 = rgb(248, 248, 247)
    expect(bg).toBe('rgb(248, 248, 247)');
  });

  // ── dark mode ───────────────────────────────────────────────────────────────

  test('post paragraph text is light in dark mode', async ({ page }) => {
    await page.locator('#theme-toggle-button').click();
    await expect(page.locator('#theme-toggle-button')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    const color = await computedStyle(page, 'article p', 'color');
    // #e7e5e4 = rgb(231, 229, 228) — light stone; readable on #111110 background
    expect(color).toBe('rgb(231, 229, 228)');
  });

  test('post heading text is light in dark mode', async ({ page }) => {
    await page.locator('#theme-toggle-button').click();
    await expect(page.locator('#theme-toggle-button')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    const color = await computedStyle(page, 'article h1', 'color');
    expect(color).toBe('rgb(231, 229, 228)');
  });

  test('page shell background is dark in dark mode', async ({ page }) => {
    await page.locator('#theme-toggle-button').click();
    await expect(page.locator('#theme-toggle-button')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    const bg = await computedStyle(
      page,
      '#common-style-div',
      'background-color',
    );
    // #111110 = rgb(17, 17, 16)
    expect(bg).toBe('rgb(17, 17, 16)');
  });
});
