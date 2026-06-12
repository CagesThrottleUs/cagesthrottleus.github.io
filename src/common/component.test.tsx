import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { mockMatchMedia, renderWithProviders } from '../test/providers';
import { CommonStyler } from './component';

beforeEach(() => {
  localStorage.clear();
  mockMatchMedia(false);
});

describe('CommonStyler', () => {
  describe('landmarks', () => {
    it('renders a banner (<header>) landmark', () => {
      renderWithProviders(<CommonStyler>content</CommonStyler>);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders a contentinfo (<footer>) landmark', () => {
      renderWithProviders(<CommonStyler>content</CommonStyler>);
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders a main landmark for page content', () => {
      renderWithProviders(<CommonStyler>content</CommonStyler>);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  describe('children', () => {
    it('renders children inside the <main> element', () => {
      renderWithProviders(
        <CommonStyler>
          <p>test content</p>
        </CommonStyler>,
      );
      const main = screen.getByRole('main');
      expect(main).toHaveTextContent('test content');
    });

    it('children are not leaked outside <main> into the header or footer', () => {
      renderWithProviders(
        <CommonStyler>
          <p>unique-child-text</p>
        </CommonStyler>,
      );
      expect(screen.getByRole('main')).toHaveTextContent('unique-child-text');
      expect(screen.getByRole('banner')).not.toHaveTextContent(
        'unique-child-text',
      );
      expect(screen.getByRole('contentinfo')).not.toHaveTextContent(
        'unique-child-text',
      );
    });
  });

  describe('DOM order', () => {
    it('<main> appears after the header and before the footer in the DOM', () => {
      const { container } = renderWithProviders(<CommonStyler>x</CommonStyler>);
      const all = container.querySelectorAll('header, main, footer');
      expect(all[0].tagName).toBe('HEADER');
      expect(all[1].tagName).toBe('MAIN');
      expect(all[2].tagName).toBe('FOOTER');
    });
  });

  describe('nav links', () => {
    it('Posts nav link is present in the layout', () => {
      renderWithProviders(<CommonStyler>x</CommonStyler>);
      expect(screen.getByRole('link', { name: 'Posts' })).toBeInTheDocument();
    });

    it('Timeline nav link is present in the layout', () => {
      renderWithProviders(<CommonStyler>x</CommonStyler>);
      expect(screen.getByRole('link', { name: 'Timeline' })).toBeInTheDocument();
    });

    it('Posts nav link href resolves to "/"', () => {
      renderWithProviders(<CommonStyler>x</CommonStyler>);
      expect(screen.getByRole('link', { name: 'Posts' })).toHaveAttribute('href', '/');
    });

    it('Timeline nav link href resolves to "/timeline"', () => {
      renderWithProviders(<CommonStyler>x</CommonStyler>);
      expect(screen.getByRole('link', { name: 'Timeline' })).toHaveAttribute('href', '/timeline');
    });

    it('nav landmark wraps both links', () => {
      renderWithProviders(<CommonStyler>x</CommonStyler>);
      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toContainElement(screen.getByRole('link', { name: 'Posts' }));
      expect(nav).toContainElement(screen.getByRole('link', { name: 'Timeline' }));
    });
  });
});
