import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.evaluate(() => localStorage.setItem('color-scheme', 'light'));
  await page.reload();
});

test('theme toggle button is visible on the page', async ({ page }) => {
  await expect(page.locator('#theme-toggle-button')).toBeVisible();
});

test('on fresh load in light mode, toggle has aria-pressed="false"', async ({ page }) => {
  await expect(page.locator('#theme-toggle-button')).toHaveAttribute('aria-pressed', 'false');
});

test('aria-label reads "Switch to dark theme" when in light mode', async ({ page }) => {
  await expect(page.locator('#theme-toggle-button')).toHaveAttribute(
    'aria-label',
    'Switch to dark theme',
  );
});

test('clicking toggle once sets aria-pressed to "true"', async ({ page }) => {
  await page.locator('#theme-toggle-button').click();
  await expect(page.locator('#theme-toggle-button')).toHaveAttribute('aria-pressed', 'true');
});

test('aria-label updates to "Switch to light theme" after toggling to dark', async ({ page }) => {
  await page.locator('#theme-toggle-button').click();
  await expect(page.locator('#theme-toggle-button')).toHaveAttribute(
    'aria-label',
    'Switch to light theme',
  );
});

test('clicking toggle a second time returns aria-pressed to "false"', async ({ page }) => {
  await page.locator('#theme-toggle-button').click();
  await page.locator('#theme-toggle-button').click();
  await expect(page.locator('#theme-toggle-button')).toHaveAttribute('aria-pressed', 'false');
});

test('aria-label returns to "Switch to dark theme" after two clicks', async ({ page }) => {
  await page.locator('#theme-toggle-button').click();
  await page.locator('#theme-toggle-button').click();
  await expect(page.locator('#theme-toggle-button')).toHaveAttribute(
    'aria-label',
    'Switch to dark theme',
  );
});

test('theme preference persists across page reload (localStorage)', async ({ page }) => {
  await page.locator('#theme-toggle-button').click();
  await expect(page.locator('#theme-toggle-button')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('#theme-toggle-button')).toHaveAttribute('aria-pressed', 'true');
});
