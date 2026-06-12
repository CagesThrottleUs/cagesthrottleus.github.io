import type { PostDeclaration } from './types';

// Single promise instance shared across the app.
// Dynamic import keeps posts/index.ts as a separate JS chunk.
// Starts loading immediately when this module is first imported,
// so by the time the home page renders, the data is often already ready.
export const postsPromise: Promise<PostDeclaration[]> = import('./index').then(
  (m) => m.default,
);
