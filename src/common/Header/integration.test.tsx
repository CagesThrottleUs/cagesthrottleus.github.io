// Integration tests for Header — no vi.mock here.
// vi.mock is hoisted to the top of whatever file it appears in, so unit tests
// (with a mocked useTheme) and integration tests (with the real ThemeProvider)
// cannot safely share a file: the mock would intercept useTheme even inside
// renderWithProviders, preventing real state changes from reaching the component.
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { mockMatchMedia, renderWithProviders } from '../../test/providers';
import { Header } from './component';

beforeEach(() => {
  localStorage.clear();
  mockMatchMedia(false);
});

describe('Header — integration (real ThemeProvider)', () => {
  it('clicking toggle flips aria-pressed from "false" to "true"', async () => {
    renderWithProviders(<Header />);
    const user = userEvent.setup();
    const toggle = screen.getByRole('button', { name: 'Switch to dark theme' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('clicking toggle updates aria-label to "Switch to light theme"', async () => {
    renderWithProviders(<Header />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole('button', { name: 'Switch to dark theme' }),
    );
    expect(
      screen.getByRole('button', { name: 'Switch to light theme' }),
    ).toBeInTheDocument();
  });

  it('clicking toggle a second time returns aria-pressed to "false"', async () => {
    renderWithProviders(<Header />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole('button', { name: 'Switch to dark theme' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Switch to light theme' }),
    );
    expect(
      screen.getByRole('button', { name: 'Switch to dark theme' }),
    ).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicking toggle a second time returns aria-label to "Switch to dark theme"', async () => {
    renderWithProviders(<Header />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole('button', { name: 'Switch to dark theme' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'Switch to light theme' }),
    );
    expect(
      screen.getByRole('button', { name: 'Switch to dark theme' }),
    ).toBeInTheDocument();
  });
});
