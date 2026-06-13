import { describe, expect, it } from 'vitest';

import {
  MONTH_ID_ATTR,
  MONTH_SECTION_ATTR,
  monthSectionElementId,
  monthSectionProps,
} from './monthSectionDom';

describe('monthSectionDom contract', () => {
  it('builds the anchor element id from the entry id', () => {
    expect(monthSectionElementId('2026-06')).toBe('month-2026-06');
  });

  it('produces props the sidebar selector and observer can read', () => {
    const props = monthSectionProps('2026-06');
    expect(props.id).toBe('month-2026-06');
    expect(props[MONTH_SECTION_ATTR]).toBe('');
    expect(props[MONTH_ID_ATTR]).toBe('2026-06');
  });
});
