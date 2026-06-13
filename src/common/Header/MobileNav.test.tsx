import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { MobileNav } from './MobileNav';

function renderMobileNav(isOpen: boolean, onClose = vi.fn()) {
  return render(
    <MemoryRouter>
      <MobileNav isOpen={isOpen} onClose={onClose} />
    </MemoryRouter>,
  );
}

describe('MobileNav', () => {
  describe('always in DOM', () => {
    it('nav element is always present regardless of open state', () => {
      const { container } = renderMobileNav(false);
      expect(container.querySelector('#mobile-nav')).toBeInTheDocument();
    });

    it('Posts link is always in the DOM', () => {
      renderMobileNav(false);
      expect(
        screen.getByRole('link', { name: 'Posts', hidden: true }),
      ).toBeInTheDocument();
    });

    it('Timeline link is always in the DOM', () => {
      renderMobileNav(false);
      expect(
        screen.getByRole('link', { name: 'Timeline', hidden: true }),
      ).toBeInTheDocument();
    });
  });

  describe('when closed', () => {
    it('nav has aria-hidden="true"', () => {
      const { container } = renderMobileNav(false);
      expect(container.querySelector('#mobile-nav')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });

    it('Posts link has tabIndex -1', () => {
      renderMobileNav(false);
      expect(
        screen.getByRole('link', { name: 'Posts', hidden: true }),
      ).toHaveAttribute('tabindex', '-1');
    });

    it('Timeline link has tabIndex -1', () => {
      renderMobileNav(false);
      expect(
        screen.getByRole('link', { name: 'Timeline', hidden: true }),
      ).toHaveAttribute('tabindex', '-1');
    });

    it('Escape key does not call onClose when already closed', () => {
      const onClose = vi.fn();
      renderMobileNav(false, onClose);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('when open', () => {
    it('nav does not have aria-hidden', () => {
      renderMobileNav(true);
      expect(
        screen.getByRole('navigation', { name: 'Mobile navigation' }),
      ).not.toHaveAttribute('aria-hidden', 'true');
    });

    it('Posts link href resolves to "/"', () => {
      renderMobileNav(true);
      expect(screen.getByRole('link', { name: 'Posts' })).toHaveAttribute(
        'href',
        '/',
      );
    });

    it('Timeline link href resolves to "/timeline"', () => {
      renderMobileNav(true);
      expect(screen.getByRole('link', { name: 'Timeline' })).toHaveAttribute(
        'href',
        '/timeline',
      );
    });

    it('Posts link has tabIndex 0', () => {
      renderMobileNav(true);
      expect(screen.getByRole('link', { name: 'Posts' })).toHaveAttribute(
        'tabindex',
        '0',
      );
    });

    it('pressing Escape calls onClose', () => {
      const onClose = vi.fn();
      renderMobileNav(true, onClose);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('clicking the backdrop calls onClose', () => {
      const onClose = vi.fn();
      const { container } = renderMobileNav(true, onClose);
      const backdrop = container.querySelector('[aria-hidden="true"]');
      fireEvent.click(backdrop!);
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('clicking the Posts link calls onClose', () => {
      const onClose = vi.fn();
      renderMobileNav(true, onClose);
      fireEvent.click(screen.getByRole('link', { name: 'Posts' }));
      expect(onClose).toHaveBeenCalledOnce();
    });

    it('clicking the Timeline link calls onClose', () => {
      const onClose = vi.fn();
      renderMobileNav(true, onClose);
      fireEvent.click(screen.getByRole('link', { name: 'Timeline' }));
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  describe('data attributes for CSS animation', () => {
    it('drawer has data-open="false" when closed', () => {
      const { container } = renderMobileNav(false);
      expect(container.querySelector('#mobile-nav')).toHaveAttribute(
        'data-open',
        'false',
      );
    });

    it('drawer has data-open="true" when open', () => {
      const { container } = renderMobileNav(true);
      expect(container.querySelector('#mobile-nav')).toHaveAttribute(
        'data-open',
        'true',
      );
    });
  });
});
