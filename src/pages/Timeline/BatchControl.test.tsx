import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BatchControl } from './BatchControl';

describe('BatchControl', () => {
  it('renders buttons for 3, 6, and 9', () => {
    render(<BatchControl value={3} onChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Load 3 months at a time' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Load 6 months at a time' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Load 9 months at a time' }),
    ).toBeInTheDocument();
  });

  it('active button has aria-pressed="true"', () => {
    render(<BatchControl value={6} onChange={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: 'Load 6 months at a time' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('button', { name: 'Load 3 months at a time' }),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByRole('button', { name: 'Load 9 months at a time' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking a button calls onChange with the correct value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<BatchControl value={3} onChange={onChange} />);
    await user.click(
      screen.getByRole('button', { name: 'Load 9 months at a time' }),
    );
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it('has an accessible group label', () => {
    const { container } = render(<BatchControl value={3} onChange={vi.fn()} />);
    expect(
      container.querySelector('[aria-label="Months per batch"]'),
    ).toBeInTheDocument();
  });
});
