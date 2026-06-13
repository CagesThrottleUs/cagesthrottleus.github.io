// DOM contract shared by MonthSection (producer) and TimelineSidebar (consumer).
// The sidebar finds sections by attribute and scrolls to them by element id;
// keeping the names here means the selector and the rendered markup cannot
// drift apart silently.

export const MONTH_SECTION_ATTR = 'data-month-section';
export const MONTH_ID_ATTR = 'data-month-id';

export function monthSectionElementId(id: string): string {
  return `month-${id}`;
}

// Attributes MonthSection must spread onto its <section> for the sidebar to
// observe and navigate to it.
export function monthSectionProps(id: string) {
  return {
    id: monthSectionElementId(id),
    [MONTH_SECTION_ATTR]: '',
    [MONTH_ID_ATTR]: id,
  };
}
