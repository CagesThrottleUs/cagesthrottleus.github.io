import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LinkedInIcon from './LinkedInIcon';

describe('LinkedInIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<LinkedInIcon />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('SVG has the 20x20 viewBox required by the S2 icon sizing system', () => {
    const { container } = render(<LinkedInIcon />);
    expect(container.querySelector('svg')).toHaveAttribute(
      'viewBox',
      '0 0 20 20',
    );
  });

  it('path fill references --iconPrimary so the icon responds to S2 theme context', () => {
    const { container } = render(<LinkedInIcon />);
    const fill = container.querySelector('path')?.getAttribute('fill') ?? '';
    expect(fill).toContain('--iconPrimary');
  });
});
