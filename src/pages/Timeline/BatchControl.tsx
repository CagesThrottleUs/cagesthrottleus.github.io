import { css } from '@react-spectrum/s2/style' with { type: 'macro' };

const SIZES = [3, 6, 9] as const;
type BatchSize = (typeof SIZES)[number];

const groupStyle = css(`
  display: flex;
  align-items: center;
  gap: 2px;
`);

const labelStyle = css(`
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: light-dark(#a8a29e, #78716c);
  margin-right: 6px;
  user-select: none;
`);

const btnStyle = css(`
  width: 30px;
  height: 26px;
  border-radius: 5px;
  border: 1px solid light-dark(#e8e7e5, #282624);
  background: transparent;
  font-size: 12px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  color: light-dark(#78716c, #a8a29e);
  transition: color 120ms ease, border-color 120ms ease, background-color 120ms ease, transform 120ms ease;

  &:hover {
    border-color: light-dark(#b45309, #d97706);
    color: light-dark(#b45309, #d97706);
  }

  &:active {
    transform: scale(0.95);
  }
`);

const btnActiveStyle = css(`
  background-color: light-dark(#b45309, #d97706);
  border-color: light-dark(#b45309, #d97706);
  color: #fff;

  &:hover {
    color: #fff;
  }
`);

interface Props {
  value: number;
  onChange: (n: BatchSize) => void;
}

export function BatchControl({ value, onChange }: Readonly<Props>) {
  return (
    <div className={groupStyle} aria-label="Months per batch">
      <span className={labelStyle}>Load</span>
      {SIZES.map((n) => (
        <button
          key={n}
          className={`${btnStyle} ${value === n ? btnActiveStyle : ''}`}
          onClick={() => {
            onChange(n);
          }}
          aria-pressed={value === n}
          aria-label={`Load ${String(n)} months at a time`}
          type="button"
        >
          {n}
        </button>
      ))}
    </div>
  );
}
