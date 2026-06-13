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

test.describe('mobile hamburger navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hamburger button is visible on mobile', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: /open navigation menu/i }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('desktop nav links are not visible on mobile', async ({ page }) => {
    await expect(
      page.getByRole('navigation', { name: 'Main navigation' }),
    ).not.toBeVisible();
  });

  test('clicking hamburger opens the mobile nav drawer', async ({ page }) => {
    await page.getByRole('button', { name: /open navigation menu/i }).click();
    await expect(
      page.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeVisible({ timeout: 5_000 });
  });

  test('mobile nav drawer contains Posts and Timeline links', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /open navigation menu/i }).click();
    const mobileNav = page.getByRole('navigation', {
      name: 'Mobile navigation',
    });
    await expect(mobileNav).toBeVisible({ timeout: 5_000 });
    await expect(mobileNav.getByRole('link', { name: 'Posts' })).toBeVisible();
    await expect(
      mobileNav.getByRole('link', { name: 'Timeline' }),
    ).toBeVisible();
  });

  test('clicking Timeline in mobile nav navigates to /timeline', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /open navigation menu/i }).click();
    await page
      .getByRole('navigation', { name: 'Mobile navigation' })
      .getByRole('link', { name: 'Timeline' })
      .click();
    await expect(
      page.getByRole('button', { name: 'Load 3 months at a time' }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('pressing Escape closes the mobile nav drawer', async ({ page }) => {
    await page.getByRole('button', { name: /open navigation menu/i }).click();
    await expect(
      page.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeVisible({ timeout: 5_000 });
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('navigation', { name: 'Mobile navigation' }),
    ).not.toBeVisible({ timeout: 3_000 });
  });

  test('clicking backdrop closes the mobile nav drawer', async ({ page }) => {
    await page.getByRole('button', { name: /open navigation menu/i }).click();
    await expect(
      page.getByRole('navigation', { name: 'Mobile navigation' }),
    ).toBeVisible({ timeout: 5_000 });
    // Click the right side of the screen (backdrop area, outside the 85vw drawer)
    await page.mouse.click(370, 400);
    await expect(
      page.getByRole('navigation', { name: 'Mobile navigation' }),
    ).not.toBeVisible({ timeout: 3_000 });
  });
});
