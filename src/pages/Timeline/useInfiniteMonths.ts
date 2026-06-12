import { useEffect, useState } from 'react';

import type { MonthEntry } from '../../cv/types';

const DEFAULT_BATCH = 3;

export function useInfiniteMonths(all: MonthEntry[]) {
  const [loadedCount, setLoadedCount] = useState(
    Math.min(DEFAULT_BATCH, all.length),
  );
  const [batchSize, setBatchSize] = useState(DEFAULT_BATCH);
  // Callback ref: React calls this with the DOM element (or null on unmount).
  // Using state rather than useRef means the effect re-runs when the sentinel
  // mounts, which is when observation should start.
  const [sentinel, setSentinel] = useState<Element | null>(null);

  const loadedMonths = all.slice(0, loadedCount);
  const hasMore = loadedCount < all.length;

  useEffect(() => {
    if (!hasMore || !sentinel) return;
    const observer = new IntersectionObserver(
      (observed) => {
        if (observed[0].isIntersecting) {
          setLoadedCount((prev) => Math.min(prev + batchSize, all.length));
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, batchSize, all.length, sentinel]);

  return { loadedMonths, hasMore, sentinelRef: setSentinel, batchSize, setBatchSize };
}
