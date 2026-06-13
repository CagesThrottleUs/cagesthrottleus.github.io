import { Button, Divider } from '@react-spectrum/s2';
import Contrast from '@react-spectrum/s2/icons/Contrast';
import Lighten from '@react-spectrum/s2/icons/Lighten';
import { css, style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { Link, NavLink } from 'react-router';

import { useTheme } from '../../ThemeProvider/hooks';

const headerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  paddingX: 32,
  paddingTop: 20,
  paddingBottom: 0,
  marginBottom: 24,
});

const topBarStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
  gap: 16,
});

const brandLinkStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderRadius: 'lg',
  textDecoration: 'none',
  paddingX: 8,
  paddingY: 8,
  cursor: 'pointer',
  transition: 'colors',
  transitionDuration: '150ms',
  transitionTimingFunction: 'in-out',
});

const brandHoverStyle = css(`
  &:hover {
    background-color: light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.07));
  }
  &:active {
    background-color: light-dark(rgba(0, 0, 0, 0.10), rgba(255, 255, 255, 0.12));
  }
`);

const monogramStyle = style({
  size: 40,
  borderRadius: 'full',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  font: 'heading-sm',
  fontWeight: 'extra-bold',
  flexShrink: 0,
  userSelect: 'none',
});

const monogramAccent = css(`
  background-color: light-dark(#b45309, #d97706);
`);

const siteNameStyle = style({
  font: 'heading-lg',
  color: 'heading',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
});

const navStyle = css(`
  display: flex;
  gap: 4px;
  align-items: center;

  @media (max-width: 640px) {
    display: none;
  }
`);

const navLinkBase = css(`
  font-size: 14px;
  font-weight: 500;
  color: light-dark(#78716c, #a8a29e);
  text-decoration: none;
  letter-spacing: -0.01em;
  padding: 6px 12px;
  border-radius: 6px;
  transition: color 150ms ease, background-color 150ms ease;

  &:hover {
    color: light-dark(#1c1917, #fafaf9);
    background-color: light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.07));
  }

  &[aria-current="page"] {
    color: light-dark(#1c1917, #fafaf9);
    font-weight: 600;
  }
`);

const actionsStyle = style({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
});

const iconWrapperStyle = style({
  display: 'inline-block',
  transition: 'transform',
  transitionDuration: '300ms',
  transitionTimingFunction: 'in-out',
});

const iconRotated = css(`transform: rotate(45deg);`);
const iconDefault = css(`transform: rotate(0deg);`);

const navSeparatorStyle = css(`
  width: 1px;
  align-self: stretch;
  margin: 4px 0;
  flex-shrink: 0;
  background-color: light-dark(rgba(0, 0, 0, 0.10), rgba(255, 255, 255, 0.10));

  @media (max-width: 640px) {
    display: none;
  }
`);

export function Header() {
  const { scheme, toggleScheme } = useTheme();

  return (
    <header className={headerStyle} id="blog-header" aria-label="Site header">
      <div className={topBarStyle}>
        <Link
          to="/"
          className={`${brandLinkStyle} ${brandHoverStyle}`}
          aria-label="Go to home"
        >
          <div
            className={`${monogramStyle} ${monogramAccent}`}
            aria-hidden="true"
          >
            C
          </div>
          <span className={siteNameStyle}>Cages&apos;</span>
        </Link>

        <div className={actionsStyle}>
          <nav className={navStyle} aria-label="Main navigation">
            <NavLink to="/" end className={navLinkBase}>
              Posts
            </NavLink>
            <NavLink to="/timeline" className={navLinkBase}>
              Timeline
            </NavLink>
          </nav>
          <div className={navSeparatorStyle} role="separator" aria-orientation="vertical" />
          <Button
            variant="secondary"
            size="M"
            onPress={toggleScheme}
            id="theme-toggle-button"
            aria-label={`Switch to ${scheme === 'light' ? 'dark' : 'light'} theme`}
            aria-pressed={scheme === 'dark'}
          >
            <span
              className={`${iconWrapperStyle} ${scheme === 'dark' ? iconRotated : iconDefault}`}
            >
              {scheme === 'light' ? <Contrast /> : <Lighten />}
            </span>
          </Button>
        </div>
      </div>
      <Divider size="S" />
    </header>
  );
}
