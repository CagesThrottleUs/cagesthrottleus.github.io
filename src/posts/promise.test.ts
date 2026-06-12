import { describe, expect, it } from 'vitest';

// No mocks — this file tests the real postsPromise module
import { postsPromise } from './promise';

describe('postsPromise', () => {
  it('exports a Promise', () => {
    expect(postsPromise).toBeInstanceOf(Promise);
  });

  it('resolves to the posts array', async () => {
    const posts = await postsPromise;
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });
});
