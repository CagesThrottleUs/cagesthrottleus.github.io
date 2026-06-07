import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Footer } from './component';

describe('Footer', () => {
  describe('landmark', () => {
    it('renders a contentinfo (footer) landmark', () => {
      render(<Footer />);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('has a horizontal separator at the top before the text row', () => {
      render(<Footer />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });
  });

  describe('copyright row', () => {
    it('displays the current calendar year — not a hardcoded value', () => {
      render(<Footer />);
      const year = new Date().getFullYear();
      expect(screen.getByRole('contentinfo')).toHaveTextContent(String(year));
    });

    it('includes the owner name "Cages\'" in the copyright line', () => {
      render(<Footer />);
      expect(screen.getByRole('contentinfo')).toHaveTextContent("Cages'");
    });

    it('includes the phrase "All rights reserved"', () => {
      render(<Footer />);
      expect(screen.getByRole('contentinfo')).toHaveTextContent(
        /all rights reserved/i,
      );
    });
  });

  describe('username', () => {
    it('displays "cagesthrottleus" on the right side', () => {
      render(<Footer />);
      expect(screen.getByText('cagesthrottleus')).toBeInTheDocument();
    });

    it('username is a sibling of the copyright span, not nested inside it', () => {
      render(<Footer />);
      const copyright = screen.getByText(/all rights reserved/i);
      const username = screen.getByText('cagesthrottleus');
      expect(copyright.closest('div')).toBe(username.closest('div'));
      expect(copyright).not.toContainElement(username as HTMLElement);
    });
  });
});
