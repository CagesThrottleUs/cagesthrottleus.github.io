import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('brand logo is an <a> element with href="/"', async ({ page }) => {
  const brand = page.getByRole('link', { name: 'Go to home' });
  await expect(brand).toBeVisible();
  await expect(brand).toHaveAttribute('href', '#/');
});

test('"GitHub profile" social button is visible in the header', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'GitHub profile' })).toBeVisible();
});

test('"LinkedIn profile" social button is visible in the header', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'LinkedIn profile' })).toBeVisible();
});

test('footer shows the current year', async ({ page }) => {
  const year = new Date().getFullYear();
  await expect(page.getByRole('contentinfo')).toContainText(String(year));
});

test('footer shows "cagesthrottleus"', async ({ page }) => {
  await expect(page.getByRole('contentinfo')).toContainText('cagesthrottleus');
});

test('footer shows "All rights reserved"', async ({ page }) => {
  await expect(page.getByRole('contentinfo')).toContainText('All rights reserved');
});
