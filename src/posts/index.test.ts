import { describe, expect, it } from 'vitest';

import posts from './index';

describe('posts collector', () => {
  it('exports a non-empty array', () => {
    expect(posts.length).toBeGreaterThan(0);
  });

  it('every post has id, title, createdAt, and Component', () => {
    for (const post of posts) {
      expect(typeof post.id).toBe('string');
      expect(post.id.length).toBeGreaterThan(0);
      expect(typeof post.title).toBe('string');
      expect(post.title.length).toBeGreaterThan(0);
      expect(typeof post.createdAt).toBe('string');
      expect(post.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof post.Component).toBe('object'); // lazy() returns an object
    }
  });

  it('posts are sorted newest first', () => {
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i].createdAt >= posts[i + 1].createdAt).toBe(true);
    }
  });

  it('all ids are unique', () => {
    const ids = posts.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// Mirrors the id-vs-directory guard in index.ts. The real registry resolves
// paths via import.meta.glob; this reimplements just the check so the failure
// mode is covered without a real mismatched fixture on disk.
function assertIdMatchesDir(metaPath: string, id: string) {
  const dir = metaPath.replace(/^\.\//, '').replace(/\/meta\.ts$/, '');
  if (id !== dir) {
    throw new Error(`Post id "${id}" must equal its directory "${dir}"`);
  }
}

describe('post id / directory guard', () => {
  it('passes when id matches the directory name', () => {
    expect(() => {
      assertIdMatchesDir(
        './2026-06-08-hello-world/meta.ts',
        '2026-06-08-hello-world',
      );
    }).not.toThrow();
  });

  it('throws when id drifts from the directory name', () => {
    expect(() => {
      assertIdMatchesDir('./2026-06-08-hello-world/meta.ts', 'wrong-slug');
    }).toThrow('must equal its directory');
  });
});
