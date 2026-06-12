import { expect, test } from '@playwright/test';

test.describe('home page card content stability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('card title stays visible after preview image finishes loading', async ({
    page,
  }) => {
    // Wait for Suspense to resolve and card title to appear
    await expect(page.getByText('Hello World')).toBeVisible();

    // Wait until every non-empty <img> on the page has fully loaded
    // Regression: previously, the card title disappeared once the preview image
    // completed loading because the waterfall layout remeasured and pushed text
    // out of the virtual viewport.
    await page.waitForFunction(
      () => {
        const imgs = Array.from(
          document.querySelectorAll<HTMLImageElement>('img[src]:not([src=""])'),
        );
        return (
          imgs.length > 0 &&
          imgs.every((img) => img.complete && img.naturalHeight > 0)
        );
      },
      { timeout: 15_000 },
    );

    // Title and description must still be visible — not hidden by a layout glitch
    await expect(page.getByText('Hello World')).toBeVisible();
    await expect(page.getByText(/An introduction to this blog/)).toBeVisible();
  });
});
