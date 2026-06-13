import type { ComponentType } from 'react';
import { lazy } from 'react';

import type { PostDeclaration, PostMeta } from './types';

// Eagerly import all meta.ts files — tiny metadata, no reason to defer.
// Vite resolves the glob at build time; each matched file is bundled here.
const metaModules = import.meta.glob<{ meta: PostMeta }>('./*/meta.ts', {
  eager: true,
});

// Lazy factories for each post component — each becomes its own JS chunk.
const componentModules = import.meta.glob<{ default: ComponentType }>(
  './*/index.tsx',
);

// Pair each meta with its component factory. A post directory without both
// files will surface an error at render time, not silently disappear.
const posts: PostDeclaration[] = Object.entries(metaModules).map(
  ([metaPath, metaModule]) => {
    // id is the URL slug; the route looks posts up by it. If it drifts from
    // the directory name, the home card links to a slug no route can resolve.
    // Fail loud at build/load rather than ship a dead "Post not found" link.
    const dir = metaPath.replace(/^\.\//, '').replace(/\/meta\.ts$/, '');
    if (metaModule.meta.id !== dir) {
      throw new Error(
        `Post id "${metaModule.meta.id}" must equal its directory "${dir}" (${metaPath})`,
      );
    }
    return {
      ...metaModule.meta,
      Component: lazy(
        componentModules[metaPath.replace('/meta.ts', '/index.tsx')],
      ),
    };
  },
);
/* v8 ignore next -- @preserve */
posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export default posts;
