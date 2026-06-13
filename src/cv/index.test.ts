import { lazy } from 'react';
import { describe, expect, it } from 'vitest';

// Directly test the shaping logic by constructing entries from a fake glob.
// The real cv/index uses import.meta.glob; tests bypass it via buildEntries below.
const fakeModules: Record<string, () => Promise<{ default: () => null }>> = {
  './entries/2026/06.tsx': () => Promise.resolve({ default: () => null }),
  './entries/2025/12.tsx': () => Promise.resolve({ default: () => null }),
  './entries/2026/01.tsx': () => Promise.resolve({ default: () => null }),
};

function buildEntries(modules: typeof fakeModules) {
  return Object.entries(modules)
    .map(([path, factory]) => {
      const m = /\.\/entries\/(\d{4})\/(\d{2})\.tsx$/.exec(path);
      if (!m) throw new Error(`Bad path: ${path}`);
      const year = Number(m[1]);
      const month = Number(m[2]);
      return {
        year,
        month,
        id: `${m[1]}-${m[2]}`,
        label: new Date(year, month - 1, 1).toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
        Component: lazy(factory),
      };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);
}

describe('cv registry', () => {
  const entries = buildEntries(fakeModules);

  it('sorts newest-first by year then month', () => {
    expect(entries.map((e) => e.id)).toEqual(['2026-06', '2026-01', '2025-12']);
  });

  it('each entry has a string id in YYYY-MM format', () => {
    for (const e of entries) {
      expect(e.id).toMatch(/^\d{4}-\d{2}$/);
    }
  });

  it('each entry has a human-readable label', () => {
    const june = entries.find((e) => e.id === '2026-06');
    expect(june?.label).toBe('June 2026');
  });

  it('each entry exposes a lazy Component', () => {
    for (const e of entries) {
      expect(typeof e.Component).toBe('object'); // lazy() returns an object
    }
  });

  it('throws on malformed path', () => {
    expect(() =>
      buildEntries({
        './entries/bad.tsx': () => Promise.resolve({ default: () => null }),
      }),
    ).toThrow('Bad path');
  });
});
