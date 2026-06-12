import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CVEntry } from './CVEntry';

describe('CVEntry', () => {
  it('renders the text content', () => {
    render(<CVEntry>Shipped feature X</CVEntry>);
    expect(screen.getByText('Shipped feature X')).toBeInTheDocument();
  });

  it('renders the bullet dash aria-hidden', () => {
    const { container } = render(<CVEntry>text</CVEntry>);
    const bullet = container.querySelector('[aria-hidden="true"]');
    expect(bullet).toBeInTheDocument();
    expect(bullet?.textContent?.trim()).toBe('–');
  });

  it('renders tooltip text when tooltip prop is provided', () => {
    render(<CVEntry tooltip="Extra context">text</CVEntry>);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Extra context');
  });

  it('does not render a tooltip element when tooltip is omitted', () => {
    render(<CVEntry>text</CVEntry>);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders as a list item', () => {
    render(
      <ul>
        <CVEntry>item</CVEntry>
      </ul>,
    );
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });
});
