import type { PostMeta } from '../types';
import preview from './preview.jpg';

export const meta: PostMeta = {
  id: '2026-06-08-hello-world',
  title: 'Hello World',
  createdAt: '2026-06-08',
  abstract:
    'An introduction to this blog — what to expect, how it is built, and where it is going.',
  // Bundled locally rather than hot-linked: a remote image was the page's
  // largest-contentful-paint element and the sole source of Lighthouse perf
  // variance. A build-time asset loads from the same origin and is hashed.
  preview,
};
