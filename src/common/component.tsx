import { css, style } from '@react-spectrum/s2/style' with { type: 'macro' };
import { type ReactNode } from 'react';

import { Footer } from './Footer/component';
import { Header } from './Header/component';

const commonSizePattern = css(`
  padding-left: 12.5vw;
  padding-right: 12.5vw;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media (max-width: 1023px) {
    padding-left: 6vw;
    padding-right: 6vw;
  }

  @media (max-width: 640px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`);

const editorialBg = css(`
  background-color: light-dark(#f8f8f7, #111110);
  color: light-dark(#1c1917, #e7e5e4);
`);

const contentPadding = style({
  padding: '0.6125%',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});

const mainStyle = style({
  flexGrow: 1,
});

export function CommonStyler({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div
      className={`${commonSizePattern} ${editorialBg}`}
      id="common-style-div"
      aria-label="Page layout"
    >
      <div className={contentPadding} id="global-padder">
        <Header />
        <main className={mainStyle}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
