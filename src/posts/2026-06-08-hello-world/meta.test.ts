import { describe, expect, it } from 'vitest';

import { meta } from './meta';

describe('HelloWorld meta', () => {
  it('has the correct id', () => {
    expect(meta.id).toBe('2026-06-08-hello-world');
  });

  it('has a non-empty title', () => {
    expect(meta.title.length).toBeGreaterThan(0);
  });

  it('createdAt is a valid ISO date string', () => {
    expect(meta.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('createdAt produces a valid Date', () => {
    const date = new Date(meta.createdAt);
    expect(date.toString()).not.toBe('Invalid Date');
  });
});
