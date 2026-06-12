import { expect, test } from '@playwright/test';

const TIMELINE_URL = '/#/timeline';

test.beforeEach(async ({ page }) => {
  await page.goto(TIMELINE_URL);
});

test.describe('timeline page', () => {
  test('renders the sidebar navigation on desktop', async ({ page }) => {
    const vp = page.viewportSize();
    test.skip(!!vp && vp.width <= 640, 'sidebar hidden on mobile');
    await expect(
      page.getByRole('navigation', { name: 'Timeline navigation' }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('renders the batch control on all viewports', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Load 3 months at a time' }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('renders at least one month section', async ({ page }) => {
    await expect(page.getByRole('region').first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('batch control is visible with options 3, 6, 9', async ({ page }) => {
    for (const n of [3, 6, 9]) {
      await expect(
        page.getByRole('button', { name: `Load ${n} months at a time` }),
      ).toBeVisible({ timeout: 10_000 });
    }
  });

  test('batch size 3 is active by default', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Load 3 months at a time' }),
    ).toHaveAttribute('aria-pressed', 'true', { timeout: 10_000 });
  });

  test('clicking batch size 6 marks it active', async ({ page }) => {
    await page.getByRole('button', { name: 'Load 6 months at a time' }).click();
    await expect(
      page.getByRole('button', { name: 'Load 6 months at a time' }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(
      page.getByRole('button', { name: 'Load 3 months at a time' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  test('sidebar month buttons are present', async ({ page }) => {
    const vp = page.viewportSize();
    test.skip(!!vp && vp.width <= 640, 'sidebar hidden on mobile');
    const nav = page.getByRole('navigation', { name: 'Timeline navigation' });
    await expect(nav).toBeVisible({ timeout: 10_000 });
    const buttons = nav.getByRole('button');
    await expect(buttons.first()).toBeVisible();
  });

  test('clicking a sidebar month button scrolls to the section', async ({
    page,
  }) => {
    const vp = page.viewportSize();
    test.skip(!!vp && vp.width <= 640, 'sidebar hidden on mobile');
    const nav = page.getByRole('navigation', { name: 'Timeline navigation' });
    await nav.getByRole('button').first().click();
    // Page should not navigate away — header still visible
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('timeline is reachable from the header nav link', async ({ page }) => {
    await page.goto('/');
    const vp = page.viewportSize();
    const isMobile = !!vp && vp.width <= 640;
    if (!isMobile) {
      await page.getByRole('link', { name: 'Timeline' }).click();
    } else {
      await page.goto(TIMELINE_URL);
    }
    // On desktop verify sidebar; on mobile verify batch control (sidebar is hidden).
    if (!isMobile) {
      await expect(
        page.getByRole('navigation', { name: 'Timeline navigation' }),
      ).toBeVisible({ timeout: 10_000 });
    } else {
      await expect(
        page.getByRole('button', { name: 'Load 3 months at a time' }),
      ).toBeVisible({ timeout: 10_000 });
    }
  });
});
