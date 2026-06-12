import type { ComponentType } from 'react';

import type { MonthEntry } from './types';

const modules = import.meta.glob('./entries/**/*.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>;

function toLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export const monthEntries: MonthEntry[] = Object.entries(modules)
  .map(([path, factory]) => {
    const m = path.match(/\.\/entries\/(\d{4})\/(\d{2})\.tsx$/);
    if (!m) throw new Error(`Unexpected cv entry path: ${path}`);
    const year = Number(m[1]);
    const month = Number(m[2]);
    return {
      year,
      month,
      id: `${m[1]}-${m[2]}`,
      label: toLabel(year, month),
      factory,
    };
  })
  .sort((a, b) => b.year - a.year || b.month - a.month);
