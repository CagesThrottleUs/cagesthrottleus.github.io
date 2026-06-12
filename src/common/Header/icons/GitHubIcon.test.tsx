import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import GitHubIcon from './GitHubIcon';

describe('GitHubIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<GitHubIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('SVG has the 20x20 viewBox required by the S2 icon sizing system', () => {
    const { container } = render(<GitHubIcon />);
    expect(container.querySelector('svg')).toHaveAttribute(
      'viewBox',
      '0 0 20 20',
    );
  });

  it('path fill references --iconPrimary so the icon responds to S2 theme context', () => {
    const { container } = render(<GitHubIcon />);
    const fill = container.querySelector('path')?.getAttribute('fill') ?? '';
    expect(fill).toContain('--iconPrimary');
  });
});
