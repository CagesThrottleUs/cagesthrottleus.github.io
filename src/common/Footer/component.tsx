import { Divider } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { Socials } from '../Header/Socials';

const rowStyle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingX: 32,
  paddingTop: 12,
  paddingBottom: 16,
});

const textStyle = style({
  font: 'detail',
  color: 'neutral-subdued',
});

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer
      id="blog-footer"
      aria-label="Site footer"
      className={style({ marginTop: 24 })}
    >
      <Divider size="S" />
      <div className={rowStyle}>
        <span className={textStyle}>
          &copy; {CURRENT_YEAR} Cages&apos;. All rights reserved.
        </span>
        <Socials size="S" />
        <span className={textStyle}>cagesthrottleus</span>
      </div>
    </footer>
  );
}
