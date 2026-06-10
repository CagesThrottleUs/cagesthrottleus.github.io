import { expect, type Page, test } from '@playwright/test';

const POST_URL = '/#/posts/2026-06-08-hello-world';
const UNKNOWN_POST_URL = '/#/posts/does-not-exist';

test.describe('post navigation', () => {
  test('navigating to a known post slug shows "Back To Home" button', async ({
    page,
  }) => {
    await page.goto(POST_URL);
    await expect(
      page.getByRole('button', { name: /back to home/i }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('clicking "Back To Home" returns to the home page with the posts grid', async ({
    page,
  }) => {
    await page.goto(POST_URL);
    await page.getByRole('button', { name: /back to home/i }).click();
    await expect(page.getByRole('grid', { name: /blog posts/i })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('header and footer are present on a post page', async ({ page }) => {
    await page.goto(POST_URL);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('visiting an unknown slug shows "Post not found"', async ({ page }) => {
    await page.goto(UNKNOWN_POST_URL);
    await expect(page.getByText('Post not found')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('the unknown slug is mentioned in the not-found message', async ({
    page,
  }) => {
    await page.goto(UNKNOWN_POST_URL);
    await expect(
      page.getByText(/no post exists with the slug "does-not-exist"/i),
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('scroll-to-top button', () => {
  // Helper: navigate to the post page and wait until PostWrapper has mounted
  // so its window scroll listener is registered before we trigger a scroll.
  async function gotoPostAndWaitForWrapper(page: Page) {
    await page.goto(POST_URL);
    await page.getByRole('button', { name: /back to home/i }).waitFor({
      state: 'visible',
      timeout: 10_000,
    });
  }

  // Helper: make the page tall enough to scroll, then scroll to 400 and
  // confirm window.scrollY actually changed (avoids a race with layout).
  async function scrollPageDown(page: Page) {
    await page.evaluate(() => {
      document.body.style.minHeight = '2000px';
      window.scrollTo(0, 400);
    });
    await page.waitForFunction(() => window.scrollY > 300, { timeout: 5_000 });
  }

  test('scroll-to-top button is absent before scrolling', async ({ page }) => {
    await page.goto(POST_URL);
    await page.getByRole('button', { name: /back to home/i }).waitFor({
      state: 'visible',
      timeout: 10_000,
    });
    await expect(
      page.getByRole('button', { name: /scroll to top/i }),
    ).not.toBeVisible();
  });

  test('scroll-to-top button appears after scrolling more than 300px', async ({
    page,
  }) => {
    await gotoPostAndWaitForWrapper(page);
    await scrollPageDown(page);
    await expect(
      page.getByRole('button', { name: /scroll to top/i }),
    ).toBeVisible({ timeout: 5_000 });
  });

  test('clicking scroll-to-top scrolls the page back to the top', async ({
    page,
  }) => {
    await gotoPostAndWaitForWrapper(page);
    await scrollPageDown(page);
    await page.getByRole('button', { name: /scroll to top/i }).click();
    await page.waitForFunction(() => window.scrollY < 50, { timeout: 5_000 });
  });
});

test.describe('home to post navigation via card', () => {
  test('home page renders the blog post card', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('grid', { name: /blog posts/i })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText('Hello World')).toBeVisible();
  });

  test('clicking the post card navigates to the post page', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.getByRole('grid', { name: /blog posts/i })).toBeVisible({
      timeout: 10_000,
    });
    await page.getByText('Hello World').first().click();
    await expect(
      page.getByRole('button', { name: /back to home/i }),
    ).toBeVisible({ timeout: 10_000 });
  });
});
