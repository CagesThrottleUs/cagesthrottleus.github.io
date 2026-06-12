import { css } from '@react-spectrum/s2/style' with { type: 'macro' };
import { useEffect, useRef, useState } from 'react';

import type { MonthEntry } from '../../cv/types';

const MONTH_ABBR = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const sidebarStyle = css(`
  position: sticky;
  top: 24px;
  width: 88px;
  flex-shrink: 0;
  align-self: flex-start;
  padding-right: 20px;
  border-right: 1px solid light-dark(#e8e7e5, #282624);

  @media (max-width: 640px) {
    display: none;
  }
`);

const progressTrackStyle = css(`
  position: relative;
  height: 2px;
  background: light-dark(#e8e7e5, #282624);
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;
`);

const progressFillStyle = css(`
  position: absolute;
  inset: 0;
  background: light-dark(#b45309, #d97706);
  transform-origin: left;
  transform: scaleX(0);
  border-radius: 2px;

  @supports (animation-timeline: scroll()) {
    animation: cv-read-progress linear both;
    animation-timeline: scroll(root);

    @keyframes cv-read-progress {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
  }
`);

const yearLabelStyle = css(`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: light-dark(#b45309, #d97706);
  margin: 14px 0 4px;
  user-select: none;
`);

const monthBtnStyle = css(`
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 2px 0;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  color: light-dark(#78716c, #a8a29e);
  transition: color 120ms ease;

  &:hover {
    color: light-dark(#1c1917, #fafaf9);
  }
`);

const monthBtnActiveStyle = css(`
  color: light-dark(#b45309, #d97706);
  font-weight: 600;
`);

interface Props {
  entries: MonthEntry[];
}

export function TimelineSidebar({ entries }: Readonly<Props>) {
  const [activeId, setActiveId] = useState<string | null>(
    entries[0]?.id ?? null,
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.getAttribute('data-month-id'));
            break;
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' },
    );
    observerRef.current = observer;

    document
      .querySelectorAll('[data-month-section]')
      .forEach((el) => { observer.observe(el); });

    return () => { observer.disconnect(); };
  }, [entries]);

  const byYear = entries.reduce<Record<number, MonthEntry[]>>((acc, e) => {
    (acc[e.year] ??= []).push(e);
    return acc;
  }, {});

  function jumpTo(id: string) {
    document
      .getElementById(`month-${id}`)
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav className={sidebarStyle} aria-label="Timeline navigation">
      <div className={progressTrackStyle} aria-hidden="true">
        <div className={progressFillStyle} />
      </div>

      {Object.entries(byYear)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([year, months]) => (
          <div key={year}>
            <div className={yearLabelStyle} aria-hidden="true">
              {year}
            </div>
            {months.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`${monthBtnStyle} ${activeId === entry.id ? monthBtnActiveStyle : ''}`}
                onClick={() => { jumpTo(entry.id); }}
                aria-current={activeId === entry.id ? 'location' : undefined}
                aria-label={entry.label}
              >
                {MONTH_ABBR[entry.month - 1]}
              </button>
            ))}
          </div>
        ))}
    </nav>
  );
}
