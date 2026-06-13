import { css } from '@react-spectrum/s2/style' with { type: 'macro' };
import { useEffect } from 'react';
import { NavLink } from 'react-router';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const backdropStyle = css(`
  position: fixed;
  inset: 0;
  background: light-dark(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.5));
  z-index: 50;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition: opacity 200ms ease, visibility 0s linear 200ms;

  &[data-open="true"] {
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
    transition: opacity 200ms ease, visibility 0s linear 0s;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`);

const drawerStyle = css(`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: min(280px, 85vw);
  background-color: light-dark(#f8f8f7, #111110);
  border-right: 1px solid light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.08));
  display: flex;
  flex-direction: column;
  padding: 72px 12px 32px;
  gap: 2px;
  z-index: 51;
  transform: translateX(-100%);
  visibility: hidden;
  transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 240ms;

  &[data-open="true"] {
    transform: translateX(0);
    visibility: visible;
    transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1), visibility 0s linear 0s;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`);

const navLinkStyle = css(`
  font-size: 15px;
  font-weight: 500;
  color: light-dark(#78716c, #a8a29e);
  text-decoration: none;
  padding: 12px 16px;
  border-radius: 8px;
  display: block;
  transition: color 150ms ease, background-color 150ms ease;

  &:hover {
    color: light-dark(#1c1917, #fafaf9);
    background-color: light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.07));
  }

  &[aria-current="page"] {
    color: light-dark(#b45309, #d97706);
    font-weight: 600;
    background-color: light-dark(rgba(180, 83, 9, 0.06), rgba(217, 119, 6, 0.08));
  }
`);

export function MobileNav({ isOpen, onClose }: Readonly<Props>) {
  useEffect(() => {
    if (!isOpen) return;

    const firstLink = document.querySelector<HTMLElement>('#mobile-nav a');
    firstLink?.focus();

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => { document.removeEventListener('keydown', handler); };
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={backdropStyle}
        data-open={String(isOpen)}
        onClick={onClose}
        aria-hidden="true"
      />
      <nav
        id="mobile-nav"
        className={drawerStyle}
        data-open={String(isOpen)}
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        <NavLink
          to="/"
          end
          className={navLinkStyle}
          onClick={onClose}
          tabIndex={isOpen ? 0 : -1}
        >
          Posts
        </NavLink>
        <NavLink
          to="/timeline"
          className={navLinkStyle}
          onClick={onClose}
          tabIndex={isOpen ? 0 : -1}
        >
          Timeline
        </NavLink>
      </nav>
    </>
  );
}
