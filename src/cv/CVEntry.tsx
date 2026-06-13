import { css } from '@react-spectrum/s2/style' with { type: 'macro' };
import type { ReactNode } from 'react';

const itemStyle = css(`
  position: relative;
  display: flex;
  gap: 10px;
  padding: 5px 0;
  font-size: 14px;
  line-height: 1.6;
  color: inherit;
  list-style: none;

  &:hover .cv-tooltip {
    opacity: 1;
    transform: translateY(0);
  }
`);

const bulletStyle = css(`
  flex-shrink: 0;
  color: light-dark(#b45309, #d97706);
  font-weight: 600;
  margin-top: 1px;
  user-select: none;
`);

const tooltipStyle = css(`
  position: absolute;
  bottom: calc(100% + 6px);
  left: 0;
  max-width: 320px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.5;
  pointer-events: none;
  z-index: 20;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 150ms ease, transform 150ms ease;
  background-color: light-dark(rgba(28, 25, 23, 0.92), rgba(15, 15, 14, 0.88));
  color: light-dark(#f8f8f7, #e7e5e4);
  backdrop-filter: blur(8px);
  border: 1px solid light-dark(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
  white-space: normal;
`);

interface Props {
  children: ReactNode;
  tooltip?: string;
}

export function CVEntry({ children, tooltip }: Readonly<Props>) {
  return (
    <li className={itemStyle}>
      <span className={bulletStyle} aria-hidden="true">
        –
      </span>
      <span>{children}</span>
      {tooltip !== undefined && (
        <span className={`cv-tooltip ${tooltipStyle}`} role="tooltip">
          {tooltip}
        </span>
      )}
    </li>
  );
}
