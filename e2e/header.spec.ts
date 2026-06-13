import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('brand logo is an <a> element with href="/"', async ({ page }) => {
  const brand = page.getByRole('link', { name: 'Go to home' });
  await expect(brand).toBeVisible();
  await expect(brand).toHaveAttribute('href', '#/');
});

test('"GitHub profile" social button is visible in the header', async ({
  page,
}) => {
  await expect(
    page.getByRole('button', { name: 'GitHub profile' }),
  ).toBeVisible();
});

test('"LinkedIn profile" social button is visible in the header', async ({
  page,
}) => {
  await expect(
    page.getByRole('button', { name: 'LinkedIn profile' }),
  ).toBeVisible();
});

test('footer shows the current year', async ({ page }) => {
  const year = new Date().getFullYear();
  await expect(page.getByRole('contentinfo')).toContainText(String(year));
});

test('footer shows "cagesthrottleus"', async ({ page }) => {
  await expect(page.getByRole('contentinfo')).toContainText('cagesthrottleus');
});

test('footer shows "All rights reserved"', async ({ page }) => {
  await expect(page.getByRole('contentinfo')).toContainText(
    'All rights reserved',
  );
});

// href attribute tests scoped to the main desktop nav.

test('Posts nav link is in the DOM pointing to home', async ({ page }) => {
  const mainNav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(mainNav.locator('a[href="#/"]')).toBeAttached();
});

test('Timeline nav link is in the DOM pointing to /timeline', async ({
  page,
}) => {
  const mainNav = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(mainNav.locator('a[href="#/timeline"]')).toBeAttached();
});

// On desktop the main nav is visible; on mobile it is intentionally hidden (display:none).
// Both outcomes are explicitly asserted so no tests are skipped.

test('Posts nav link visibility matches viewport width', async ({ page }) => {
  const vp = page.viewportSize();
  const isMobile = !!vp && vp.width <= 640;
  const mainNav = page.getByRole('navigation', { name: 'Main navigation' });
  if (isMobile) {
    await expect(mainNav.locator('a[href="#/"]')).not.toBeVisible();
  } else {
    await expect(mainNav.getByRole('link', { name: 'Posts' })).toBeVisible();
  }
});

test('Timeline nav link visibility matches viewport width', async ({
  page,
}) => {
  const vp = page.viewportSize();
  const isMobile = !!vp && vp.width <= 640;
  const mainNav = page.getByRole('navigation', { name: 'Main navigation' });
  if (isMobile) {
    await expect(mainNav.locator('a[href="#/timeline"]')).not.toBeVisible();
  } else {
    await expect(
      mainNav.getByRole('link', { name: 'Timeline' }),
    ).toBeVisible();
  }
});

test('navigating to /timeline shows the timeline page', async ({ page }) => {
  // On desktop: click the visible nav link. On mobile: navigate directly.
  const vp = page.viewportSize();
  const isMobile = !!vp && vp.width <= 640;
  if (isMobile) {
    await page.goto('/#/timeline');
    // Sidebar is hidden on mobile — verify the batch control is present instead.
    await expect(
      page.getByRole('button', { name: 'Load 3 months at a time' }),
    ).toBeVisible({ timeout: 10_000 });
  } else {
    await page.getByRole('link', { name: 'Timeline' }).click();
    await expect(
      page.getByRole('navigation', { name: 'Timeline navigation' }),
    ).toBeVisible({ timeout: 10_000 });
  }
});
