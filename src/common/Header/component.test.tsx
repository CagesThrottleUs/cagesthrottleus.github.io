import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Header } from './component';

// ─── Unit tests — useTheme is mocked so we can control scheme ─────────────────

const mockToggleScheme = vi.fn();
const mockUseTheme = vi.fn(() => ({
  scheme: 'light',
  toggleScheme: mockToggleScheme,
}));

vi.mock('../../ThemeProvider/hooks', () => ({
  useTheme: () => mockUseTheme(),
}));

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

describe('Header — unit (useTheme mocked)', () => {
  beforeEach(() => {
    mockToggleScheme.mockReset();
    mockUseTheme.mockReturnValue({
      scheme: 'light',
      toggleScheme: mockToggleScheme,
    });
  });

  describe('landmark and structure', () => {
    it('renders a <header> banner landmark', () => {
      renderHeader();
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('monogram circle contains the letter "C"', () => {
      renderHeader();
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    it('site name "Cages\'" is present in the document', () => {
      renderHeader();
      expect(screen.getByText("Cages'")).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('renders a navigation landmark', () => {
      renderHeader();
      expect(
        screen.getByRole('navigation', { name: 'Main navigation' }),
      ).toBeInTheDocument();
    });

    it('Posts link is present and links to "/"', () => {
      renderHeader();
      const link = screen.getByRole('link', { name: 'Posts' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });

    it('Timeline link is present and links to "/timeline"', () => {
      renderHeader();
      const link = screen.getByRole('link', { name: 'Timeline' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/timeline');
    });
  });

  describe('brand link', () => {
    it('brand area is rendered as an <a> element — it is navigable, not a plain div', () => {
      renderHeader();
      const link = screen.getByRole('link', { name: 'Go to home' });
      expect(link.tagName).toBe('A');
    });

    it('brand link href resolves to "/"', () => {
      renderHeader();
      expect(screen.getByRole('link', { name: 'Go to home' })).toHaveAttribute(
        'href',
        '/',
      );
    });

    it('brand link has aria-label "Go to home" for screen-reader users', () => {
      renderHeader();
      expect(
        screen.getByRole('link', { name: 'Go to home' }),
      ).toBeInTheDocument();
    });
  });

  describe('theme toggle — light scheme', () => {
    it('toggle button exists in the document', () => {
      renderHeader();
      expect(
        screen.getByRole('button', { name: /switch to/i }),
      ).toBeInTheDocument();
    });

    it('aria-label says "Switch to dark theme" when current scheme is light', () => {
      renderHeader();
      expect(
        screen.getByRole('button', { name: 'Switch to dark theme' }),
      ).toBeInTheDocument();
    });

    it('aria-pressed is "false" when scheme is light', () => {
      renderHeader();
      expect(
        screen.getByRole('button', { name: 'Switch to dark theme' }),
      ).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('theme toggle — dark scheme', () => {
    beforeEach(() => {
      mockUseTheme.mockReturnValue({
        scheme: 'dark',
        toggleScheme: mockToggleScheme,
      });
    });

    it('aria-label says "Switch to light theme" when current scheme is dark', () => {
      renderHeader();
      expect(
        screen.getByRole('button', { name: 'Switch to light theme' }),
      ).toBeInTheDocument();
    });

    it('aria-pressed is "true" when scheme is dark', () => {
      renderHeader();
      expect(
        screen.getByRole('button', { name: 'Switch to light theme' }),
      ).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
