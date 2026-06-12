import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { describe, expect, it } from 'vitest';

import { AllProviders } from '../test/wrapper';
import posts from './index';

describe('posts — lazy component loading', () => {
  it('lazy component factory resolves and renders the post', async () => {
    expect(posts.length).toBeGreaterThan(0);
    const PostComponent = posts[0].Component;

    render(
      <AllProviders>
        <Suspense fallback={<div>loading</div>}>
          <PostComponent />
        </Suspense>
      </AllProviders>,
    );

    // findByRole waits for Suspense to resolve (lazy factory is invoked)
    await expect(
      screen.findByRole('heading', { level: 1 }),
    ).resolves.toBeInTheDocument();
  });
});
