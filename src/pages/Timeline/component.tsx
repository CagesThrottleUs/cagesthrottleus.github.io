import { css } from '@react-spectrum/s2/style' with { type: 'macro' };

import { monthEntries } from '../../cv/index';
import { BatchControl } from './BatchControl';
import { MonthSection } from './MonthSection';
import { TimelineSidebar } from './TimelineSidebar';
import { useInfiniteMonths } from './useInfiniteMonths';

const pageStyle = css(`
  display: flex;
  gap: 40px;
  padding: 40px 0 80px;
  min-height: 100dvh;
`);

const contentStyle = css(`
  flex: 1;
  min-width: 0;
`);

const controlsRowStyle = css(`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
`);

const sentinelStyle = css(`
  height: 1px;
  width: 100%;
`);

const endNoteStyle = css(`
  font-size: 13px;
  color: light-dark(#78716c, #a8a29e);
  padding: 32px 0;
  text-align: center;
`);

const emptyStyle = css(`
  font-size: 14px;
  color: light-dark(#78716c, #a8a29e);
  padding: 48px 0;
`);

export default function TimelinePage() {
  const { loadedMonths, hasMore, sentinelRef, batchSize, setBatchSize } =
    useInfiniteMonths(monthEntries);

  if (monthEntries.length === 0) {
    return (
      <p className={emptyStyle}>No timeline entries yet. Check back soon.</p>
    );
  }

  return (
    <div className={pageStyle}>
      <TimelineSidebar entries={loadedMonths} />

      <div className={contentStyle}>
        <div className={controlsRowStyle}>
          <BatchControl value={batchSize} onChange={setBatchSize} />
        </div>

        {loadedMonths.map((entry) => (
          <MonthSection key={entry.id} entry={entry} />
        ))}

        {hasMore ? (
          <div
            ref={sentinelRef}
            className={sentinelStyle}
            aria-hidden="true"
          />
        ) : (
          <p className={endNoteStyle}>All entries loaded.</p>
        )}
      </div>
    </div>
  );
}
