import { Button } from '@react-spectrum/s2';
import { style } from '@react-spectrum/s2/style' with { type: 'macro' };

import { SOCIAL_LINKS } from './constants';

const containerStyle = style({
  display: 'flex',
  gap: 4,
  alignItems: 'center',
});

interface SocialsProps {
  readonly size?: 'S' | 'M' | 'L';
}

export function Socials({ size = 'M' }: SocialsProps) {
  return (
    <div className={containerStyle} aria-label="Social links">
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <Button
          key={href}
          variant="secondary"
          size={size}
          aria-label={label}
          onPress={() => {
            window.open(href, '_blank', 'noopener,noreferrer');
          }}
        >
          <Icon />
        </Button>
      ))}
    </div>
  );
}
