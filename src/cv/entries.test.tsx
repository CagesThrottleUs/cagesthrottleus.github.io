import { render } from '@testing-library/react';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

// Eager-load every month entry component so each default export is exercised.
// This is a smoke test: verifies the component renders without throwing and
// produces at least one list item (CVEntry renders <li>).
const modules = import.meta.glob<{ default: ComponentType }>(
  './entries/**/*.tsx',
  { eager: true },
);

describe('cv month entries – smoke render', () => {
  const entries = Object.entries(modules);

  it('discovers all expected entry files', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  for (const [path, mod] of entries) {
    it(`${path} renders without crashing and produces at least one item`, () => {
      const { container } = render(
        <ul>
          <mod.default />
        </ul>,
      );
      const items = container.querySelectorAll('li');
      expect(items.length).toBeGreaterThan(0);
    });
  }
});
