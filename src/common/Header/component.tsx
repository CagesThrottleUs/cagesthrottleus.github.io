import { Button, Divider } from '@react-spectrum/s2';
import Contrast from '@react-spectrum/s2/icons/Contrast';
import Lighten from '@react-spectrum/s2/icons/Lighten';
import { css, style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { Link } from 'react-router';

import { useTheme } from '../../ThemeProvider/hooks';
import { Socials } from './Socials';

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
});

const brandBaseStyle = style({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
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
  size: 44,
  borderRadius: 'full',
  backgroundColor: 'accent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  font: 'heading-sm',
  fontWeight: 'extra-bold',
  flexShrink: 0,
  userSelect: 'none',
});

const titleGroupStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

const siteNameStyle = style({
  font: 'heading-lg',
  color: 'heading',
  textTransform: 'uppercase',
});

const taglineStyle = style({
  font: 'detail',
  color: 'neutral-subdued',
});

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

export function Header() {
  const { scheme, toggleScheme } = useTheme();

  return (
    <header
      className={headerStyle}
      id="blog-header"
      aria-label="Site header"
    >
      <div className={topBarStyle}>
        <Link
          to="/"
          className={`${brandBaseStyle} ${brandHoverStyle}`}
          aria-label="Go to home"
        >
          <div className={monogramStyle} aria-hidden="true">C</div>
          <div className={titleGroupStyle}>
            <span className={siteNameStyle}>Cages&apos;</span>
            <span className={taglineStyle}>Research &amp; Technical Blog</span>
          </div>
        </Link>
        <div className={actionsStyle}>
          <Socials />
          <Button
            variant="secondary"
            size="M"
            onPress={toggleScheme}
            id="theme-toggle-button"
            aria-label={`Switch to ${scheme === 'light' ? 'dark' : 'light'} theme`}
            aria-pressed={scheme === 'dark'}
          >
            <span
              className={iconWrapperStyle}
              style={{ transform: scheme === 'dark' ? 'rotate(45deg)' : 'rotate(0deg)' }}
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
