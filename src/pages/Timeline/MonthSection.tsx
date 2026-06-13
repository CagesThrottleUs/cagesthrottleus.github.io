import { ProgressBar } from '@react-spectrum/s2';
import { css } from '@react-spectrum/s2/style' with { type: 'macro' };
import { Suspense } from 'react';

import type { MonthEntry } from '../../cv/types';
import { monthSectionProps } from './monthSectionDom';

const sectionStyle = css(`
  padding: 32px 0 48px;
  border-bottom: 1px solid light-dark(#e8e7e5, #282624);
  scroll-margin-top: 24px;
`);

const headingStyle = css(`
  font-size: clamp(1.1rem, 2.5vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: inherit;
  margin: 0 0 20px;
`);

const listStyle = css(`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
`);

const loadingStyle = css(`
  padding: 12px 0;
`);

interface Props {
  entry: MonthEntry;
}

export function MonthSection({ entry }: Readonly<Props>) {
  const { Component } = entry;

  return (
    <section
      {...monthSectionProps(entry.id)}
      className={sectionStyle}
      aria-label={entry.label}
    >
      <h2 className={headingStyle}>{entry.label}</h2>
      <Suspense
        fallback={
          <div className={loadingStyle}>
            <ProgressBar
              aria-label={`Loading ${entry.label}`}
              isIndeterminate
              size="S"
            />
          </div>
        }
      >
        <ul className={listStyle}>
          <Component />
        </ul>
      </Suspense>
    </section>
  );
}
