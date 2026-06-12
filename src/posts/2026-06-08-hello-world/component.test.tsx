import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AllProviders } from '../../test/wrapper';
import HelloWorldPost from './index';

describe('HelloWorldPost', () => {
  it('renders the post title', () => {
    render(<HelloWorldPost />, { wrapper: AllProviders });
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders body content', () => {
    render(<HelloWorldPost />, { wrapper: AllProviders });
    expect(screen.getByText(/first post/i)).toBeInTheDocument();
  });
});
